"use client";

import { executeQuery, initDB } from "@/lib/engine/sqlEngine";
import { Database } from "sql.js";
import { useState, useEffect } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import LeftPanel from "../comps/LeftPanel";

export default function page() {
  const [db, setDB] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //creating db instance
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
    <div className="h-screen w-screen p-2">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={35}>
          <LeftPanel />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65}>
          <div className="flex items-center justify-center p-6">
            <span className="font-semibold">Content</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
