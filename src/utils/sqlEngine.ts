import initSqlJs, { Database, SqlJsStatic, QueryExecResult } from "sql.js";
import {
  getMetadata,
  Metadata,
  processMetadata,
  setMetadata,
} from "./metadata";

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

export interface DBinitTypes {
  db: Database;
  schema: Metadata | null;
}

let dbInstance: Database | null = null;

const backendURL = process.env.NEXT_PUBLIC_QUERY_BACKEND;
const startingMetadata: Metadata = {
  schema: {
    oraczen: {
      columns: [
        {
          name: "created_on",
          type: "VARCHAR(100)",
          nullable: true,
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
/**
 * Initializes an in-memory SQLite database.
 * @returns A promise resolving to the Database instance.
 */
export async function initDB(): Promise<DBinitTypes> {
  //this is shady idk what this will do
  if (dbInstance) return { db: dbInstance, schema: getMetadata() }; // Prevents reinitialization

  const SQL: SqlJsStatic = await initSqlJs({
    locateFile: () => "/sql-wasm.wasm",
  });

  const db = new SQL.Database();
  db.run(`
    CREATE TABLE oraczen (created_on TEXT DEFAULT (datetime('now')));
    INSERT INTO oraczen DEFAULT VALUES;
  `);

  dbInstance = db;
  return { db: db, schema: startingMetadata };
}

/**
 * Loads an SQLite database from a file and sets it globally.
 * @param file - The uploaded SQLite file.
 * @returns A promise resolving to the Database instance.
 */
export async function loadDBFromFile(file: File): Promise<DBinitTypes> {
  if (!file.name.endsWith(".sqlite") && !file.name.endsWith(".db")) {
    throw new Error("Invalid file type. Please upload a .sqlite or .db file.");
  }

  const buffer = await file.arrayBuffer();
  const SQL: SqlJsStatic = await initSqlJs({
    locateFile: () => "/sql-wasm.wasm",
  });

  //////////very important needs a error check here
  const db = new SQL.Database(new Uint8Array(buffer));
  const schema = processMetadata(generateSchema(db)[0]);
  setMetadata(schema);
  dbInstance = db;
  return { db: db, schema: schema };
}

/**
 * Retrieves the current database instance.
 * @returns The database instance or null if not initialized.
 */
export const getDatabaseInstance = (): Database | null => dbInstance;

/**
 * Initializes the database based on input.
 * - If a file is provided, loads it.
 * - Otherwise, creates a new database.
 * @param file - Optional SQLite file.
 * @returns A promise resolving to a database instance.
 */
export const initializeDatabase = async (
  file?: File | null,
): Promise<DBinitTypes> => (file ? loadDBFromFile(file) : initDB());

/**
 * Executes a SQL query on the local database or sends it to the backend.
 * @param query - The SQL query string to execute.
 * @param connection_string - Connection string for the database. Optional.
 * @returns An object containing a success flag, data, error, and duration.
 */
export const executeQuery = async (
  query: string,
  connection_string: string | null,
): Promise<{
  success: boolean;
  data?: RowData[];
  error?: string;
  duration?: string;
}> => {
  try {
    const db = getDatabaseInstance();
    if (!connection_string && !db)
      throw new Error("DB instance lost. Restart session");
    if (db) {
      const startTime = performance.now();
      const res = db.exec(query);
      const duration = (performance.now() - startTime).toFixed(2);

      const data = res.length > 0 ? transformSQLResult(res[0]) : [];
      const schema = generateSchema(db);
      setMetadata(processMetadata(schema[0]));
      return { success: true, data, duration };
    }

    // If no local DB, fallback to backend
    const response = await fetch(`${backendURL}execute_query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, connection_string }),
    });

    if (!response.ok)
      throw new Error(`Invalid server response: ${response.status}`);

    const result = await response.json();
    if (!result.success)
      return { success: false, error: `Query failed: ${result.message}` };

    return {
      success: true,
      data: result.data || [],
      duration: (result.duration * 1000).toFixed(2),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

/**
 * Generates database schema by extracting table and column metadata.
 * @param db - The local SQLite database instance.
 * @returns Query execution result containing schema metadata.
 */
const generateSchema = (db: Database): QueryExecResult[] => {
  return db.exec(`
    SELECT m.name AS table_name, p.name AS column_name, p.type
    FROM sqlite_master AS m
    JOIN pragma_table_info(m.name) AS p
    WHERE m.type = 'table';
  `);
};

/**
 * Transforms SQL.js query results into structured RowData format.
 * @param result - The SQL.js query execution result.
 * @returns An array of RowData objects.
 */
const transformSQLResult = (result: QueryExecResult): RowData[] => {
  return result.values.map((row) =>
    Object.fromEntries(result.columns.map((col, index) => [col, row[index]])),
  );
};
