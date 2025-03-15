"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateResult } from "@/store/store";

//util
import { initDB, executeQuery } from "@/lib/engine/sqlEngine";

//types
import { Database } from "sql.js";

//shadcn
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

//comps
import LeftPanel from "../comps/LeftPanel";
import RightPanel from "../comps/RightPanel";

export default function page() {
  const [db, setDB] = useState<Database | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

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

  const exec = (value: string): void => {
    const trimmedValue = value.trim();
    if (trimmedValue == "" || !db) return;

    const result = executeQuery(db, trimmedValue);
    if (result.success) {
      if (!result.data) return;
      dispatch(updateResult(result.data));
      return;
    }
    console.log(result.error);
    //add the error toast here
    //set the store result here
  };

  return (
    <div className="h-screen w-screen p-2">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={35}>
          <LeftPanel exec={exec} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65}>
          <RightPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
