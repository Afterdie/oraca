import initSqlJs, { Database, SqlJsStatic, QueryExecResult } from "sql.js";

/**
 * Initializes the SQL.js database.
 * @returns Promise that resolves to Database
 */
export async function initDB(): Promise<Database> {
  const SQL: SqlJsStatic = await initSqlJs({
    locateFile: () =>
      "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm",
  });
  const db = new SQL.Database();
  const initQuery = `CREATE TABLE meta (created_on TEXT DEFAULT (datetime('now')));
  INSERT INTO meta DEFAULT VALUES;`;
  db.exec(initQuery);
  return db;
}

/**
 * Executes a SQL query on the given database.
 * @param db - The Database instance.
 * @param query - The SQL query string to execute.
 * @returns An object containing a success flag of type bool and either the result or an error.
 */
export function executeQuery(
  db: Database,
  query: string,
): { success: boolean; data?: QueryExecResult[]; error?: string } {
  try {
    const result = db.exec(query);
    return { success: true, data: result };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
