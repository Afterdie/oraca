import { QueryExecResult } from "sql.js";

interface ColumnSchema {
  name: string;
  type: string;
  nullable: boolean;
}

interface ForeignKeySchema {
  column: string[];
  references_table: string;
  referenced_column: string[];
}

interface RelationshipSchema {
  from_table: string;
  from_columns: string[];
  to_table: string;
  to_columns: string[];
}

interface IndexSchema {
  name: string;
  columns: string[];
  unique: boolean;
}

export interface TableStats {
  row_count: number;
  cardinality: Record<string, number>;
}
export interface TableSchema {
  columns: ColumnSchema[];
  foreign_keys: ForeignKeySchema[];
  relationships: RelationshipSchema[];
  indexes: IndexSchema[];
}

export interface Metadata {
  schema: Record<string, TableSchema>;
  stats: Record<string, TableStats>;
}

let metadata: Metadata = {
  schema: {
    oraczen: {
      columns: [
        {
          name: "created_on",
          type: "TEXT",
          nullable: false,
        },
      ],
      foreign_keys: [],
      relationships: [],
      indexes: [],
    },
  },
  stats: {
    oraczen: {
      row_count: 1,
      cardinality: {
        created_on: 1.0,
      },
    },
  },
};

export const getMetadata = (): Metadata => metadata;

export const setMetadata = (newMetadata: Metadata): void => {
  metadata = newMetadata;
};

//this takes in the raw input and translates to db friendly structure
export const processMetadata = (data: QueryExecResult): Metadata => {
  //not processing the stats currently
  const transformedSchema: Record<string, TableSchema> = {};

  data.values.forEach((row) => {
    const tableName = String(row[0] ?? "");
    const columnName = String(row[1]);
    const columnType = String(row[2]);

    if (!tableName) {
      throw new Error("Invalid table name encountered");
    }

    if (!transformedSchema[tableName]) {
      transformedSchema[tableName] = {
        columns: [],
        foreign_keys: [],
        relationships: [],
        indexes: [],
      };
    }

    transformedSchema[tableName].columns.push({
      name: columnName,
      type: columnType,
      nullable: false, // Assuming nullable information is not available currently not being tracked
    });
  });

  return {
    schema: transformedSchema,
    stats: {},
  };
};
