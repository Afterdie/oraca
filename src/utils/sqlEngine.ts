import initSqlJs, { Database, SqlJsStatic, QueryExecResult } from "sql.js";
//import { setSchema, processSchema } from "./schema";
/**
 * Initializes the SQL.js database for local querying.
 * @returns Promise that resolves to Database
 */
export async function initDB(): Promise<Database> {
  const SQL: SqlJsStatic = await initSqlJs({
    locateFile: () => "/sql-wasm.wasm",
  });
  const db = new SQL.Database();
  const initQuery = `CREATE TABLE oraczen (created_on TEXT DEFAULT (datetime('now')));
  INSERT INTO oraczen DEFAULT VALUES;`;
  db.run(initQuery);
  return db;
}

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

interface TableSchema {
  columns: ColumnSchema[];
  foreign_keys: ForeignKeySchema[];
  relationships: string[];
}

//servers response when a schema is requested
export interface SchemaResponseTypes {
  success: boolean;
  schema?: Record<string, TableSchema>;
  message?: string;
}

export interface RowData {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | Date
    | Array<string | number | boolean | null | Date | Record<string, unknown>>
    | Record<string, unknown>;
}
//servers response when a query is executed
interface QueryExecResponseTypes {
  success: boolean;
  message?: string;
  data?: RowData[];
}

const backendURL = process.env.NEXT_PUBLIC_QUERY_BACKEND;

/**
 * Executes a SQL query on the given database.
 * @param value - The SQL query string to execute.
 * @param db - The local Database instance. Optional
 * @param connection_string - Connection string for the database. Optional
 * @returns An object containing a success flag of type bool and either the result or an error.
 */
export async function executeQuery(
  value: string,
  db: Database | null,
  connection_string: string | null,
): Promise<{
  success: boolean;
  data?: RowData[];
  error?: string;
  duration?: string;
}> {
  const query = value.trim();
  const startTime = performance.now();
  let result: RowData[] = [];
  let endTime = performance.now();
  try {
    //local execution
    if (db) {
      //getting the first index might not be the best plan
      const res = db.exec(query);
      if (res.length > 0)
        result = res.length > 0 ? transformSQLResult(db.exec(query)[0]) : [];
      endTime = performance.now();

      //remove this for now setSchema(processSchema(schema[0]));
    } else {
      const response = await fetch(`${backendURL}execute_query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query,
          connection_string: connection_string,
        }),
      });

      const res: QueryExecResponseTypes = await response.json();
      if (!res.success)
        return { success: false, error: "Failed to perform query" };
      result = res.data || [];
      endTime = performance.now();
    }
    return {
      success: true,
      data: result,
      duration: (endTime - startTime).toFixed(2),
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error.message };
    else return { success: false, error: "Unknown error" };
  }
}

//incase opted out of auto schema update make this public
//error check? tihs is for local db
// const generateSchema = (db: Database): QueryExecResult[] => {
//   return db.exec(
//     "SELECT m.name AS table_name, p.name AS column_name, p.type FROM sqlite_master AS m JOIN pragma_table_info(m.name) AS p WHERE m.type = 'table';",
//   );
// };

const transformSQLResult = (result: QueryExecResult): RowData[] => {
  console.log(result);

  const { columns, values } = result;

  return values.map((row) => {
    return Object.fromEntries(columns.map((col, index) => [col, row[index]]));
  });
};
