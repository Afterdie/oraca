import initSqlJs, { Database, SqlJsStatic, QueryExecResult } from "sql.js";
import { processMetadata, setMetadata } from "./schema";

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

//this has to be any or else the transform function breaks
export interface RowData {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | Date
    | Array<any> // eslint-disable-line @typescript-eslint/no-explicit-any
    | Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const backendURL = process.env.NEXT_PUBLIC_QUERY_BACKEND;

/**
 * Executes a SQL query on the given database.
 * @param value - The SQL query string to execute.
 * @param db - The local Database instance. Optional
 * @param connection_string - Connection string for the database. Optional
 * @returns An object containing a success flag of type bool and either the result or an error.
 */
export const executeQuery = async (
  query: string,
  db: Database | null,
  connection_string: string | null,
): Promise<{
  success: boolean;
  data?: RowData[];
  error?: string;
  duration?: string;
}> => {
  let data: RowData[] = [];
  let duration = null;
  //local execution
  try {
    if (db) {
      //getting the first index might not be the best plan
      const startTime = performance.now();
      const res = db.exec(query);
      duration = performance.now() - startTime;
      if (res.length > 0)
        data = res.length > 0 ? transformSQLResult(db.exec(query)[0]) : [];
      const schema = generateSchema(db);
      //console.log(processSchema(schema[0]));
      setMetadata(processMetadata(schema[0]));
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
      if (!response.ok)
        throw new Error(`Invalid server response ${response.status}`);

      const result = await response.json();
      if (!result.success)
        return {
          success: false,
          error: `Failed to perform query: ${result.message}`,
        };
      data = result.data || [];
      duration = result.duration * 1000;
    }
    return {
      success: true,
      data: data,
      duration: duration.toFixed(2),
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error: error.message };
    else return { success: false, error: "Something went wrong" };
  }
};

// incase opted out of auto schema update make this public
// error check? tihs is for local db
const generateSchema = (db: Database): QueryExecResult[] => {
  return db.exec(
    "SELECT m.name AS table_name, p.name AS column_name, p.type FROM sqlite_master AS m JOIN pragma_table_info(m.name) AS p WHERE m.type = 'table';",
  );
};

//transform the result to match the backend format
const transformSQLResult = (result: QueryExecResult): RowData[] => {
  const { columns, values } = result;

  return values.map((row) => {
    return Object.fromEntries(columns.map((col, index) => [col, row[index]]));
  });
};
