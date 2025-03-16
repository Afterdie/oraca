import { QueryExecResult } from "sql.js";

export type TableSchema = {
  [key: string]: {
    [column: string]: string;
  };
};

export type Relationship = {
  table: string;
  field: string;
  references: string;
  relation: "one-to-one" | "one-to-many" | "many-to-many";
};

export type DatabaseSchema = {
  tables: TableSchema;
  relationships: Relationship[];
};

let schema: DatabaseSchema = {
  tables: {},
  relationships: [],
};

export const getSchema = (): DatabaseSchema => schema;

export const setSchema = (newSchema: DatabaseSchema): void => {
  schema = newSchema;
};

export const processSchema = (data: QueryExecResult): DatabaseSchema => {
  const transformedSchema: DatabaseSchema = { tables: {}, relationships: [] };

  data.values.forEach((row) => {
    const tableName = String(row[0] ?? "");
    const columnName = String(row[1]);
    const columnType = String(row[2]);

    if (!tableName) {
      throw new Error("Invalid table name encountered");
    }

    if (!transformedSchema.tables[tableName]) {
      transformedSchema.tables[tableName] = {};
    }

    transformedSchema.tables[tableName][columnName] = columnType;
  });

  return transformedSchema;
};
