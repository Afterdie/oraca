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

export interface TableSchema {
  columns: ColumnSchema[];
  foreign_keys: ForeignKeySchema[];
  relationships: RelationshipSchema[];
}

let schema: Record<string, TableSchema> = {
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
  },
};

export const getSchema = (): Record<string, TableSchema> => schema;

export const setSchema = (newSchema: Record<string, TableSchema>): void => {
  schema = newSchema;
};

//this takes in the raw input and translates to db friendly structure
export const processSchema = (
  data: QueryExecResult,
): Record<string, TableSchema> => {
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
      };
    }

    transformedSchema[tableName].columns.push({
      name: columnName,
      type: columnType,
      nullable: false, // Assuming nullable information is not available currently not being tracked
    });
  });

  return transformedSchema;
};
