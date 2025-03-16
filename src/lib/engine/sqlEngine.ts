import initSqlJs, { Database, SqlJsStatic, QueryExecResult } from "sql.js";

/**
 * Initializes the SQL.js database.
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

/**
 * Executes a SQL query on the given database.
 * @param db - The Database instance.
 * @param query - The SQL query string to execute.
 * @returns An object containing a success flag of type bool and either the result or an error.
 */
export function executeQuery(
  db: Database,
  query: string,
): {
  success: boolean;
  data?: QueryExecResult[];
  error?: string;
  duration?: string;
  schema?: QueryExecResult[];
} {
  try {
    const startTime = performance.now();
    const result = db.exec(query);
    const endTime = performance.now();

    //fetches all tables their column_names and the datatype
    //ensure realtime context availability
    const schema = getSchema(db);

    return {
      success: true,
      data: result,
      duration: (endTime - startTime).toFixed(2),
      schema: schema,
    };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

//incase opted out of auto schema update make this public
//error check?
function getSchema(db: Database): QueryExecResult[] {
  return db.exec(
    "SELECT m.name AS table_name, p.name AS column_name, p.type FROM sqlite_master AS m JOIN pragma_table_info(m.name) AS p WHERE m.type = 'table';",
  );
}
