"use client";

import { executeQuery, initDB } from "@/lib/engine/sqlEngine";
import { Database } from "sql.js";
import { useState, useEffect } from "react";

export default function page() {
  const [db, setDB] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function setupDB() {
      try {
        const d = await initDB();
        setDB(d);
      } catch (e) {
        console.log(e);
        setError("Failed to initialise Database");
      } finally {
        console.log("reached here");
        setLoading(false);
      }
    }
    setupDB();
  }, []);
  const generate = async () => {
    if (!db) {
      setError("The DB is not ready yet");
      return;
    }
    const res = await executeQuery(db, "SELECT * FROM meta");
    console.log(res);
  };
  return (
    <div>
      <h1>Bruh</h1>
      <p>{error}</p>
      {!loading && <button onClick={generate}>fuck</button>}
    </div>
  );
}
