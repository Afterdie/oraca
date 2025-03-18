"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateResult, updateSchema } from "@/store/store";

//util
import { initDB, executeQuery } from "@/utils/sqlEngine";
import { setSchema, processSchema } from "@/utils/schema";

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

const Page = () => {
  const [db, setDB] = useState<Database | null>(null);
  //const [loading, setLoading] = useState(true);
  //const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    async function setupDB() {
      try {
        const d = await initDB();
        setDB(d);
      } catch (e) {
        console.log(e);
        //setError("Failed to initialise Database");
      } finally {
        console.log("reached here");
      }
    }
    setupDB();
  }, []);

  //if i add connectors then only this needs to be modified
  const exec = (value: string): void => {
    const trimmedValue = value.trim();
    if (trimmedValue == "" || !db) return;
    console.log(trimmedValue);
    const result = executeQuery(db, trimmedValue);
    console.log(result);
    if (result.success) {
      if (!result.data || !result.duration || !result.schema) return;
      const processedSchema = processSchema(result.schema[0]);
      dispatch(updateResult({ value: result.data, duration: result.duration }));
      //when dispatching for store directlly store the process results
      dispatch(updateSchema(processedSchema));
      setSchema(processedSchema);
      return;
    }
    //setError(result.error ?? "");
  };

  return (
    <div className="relative h-screen w-screen p-2">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} className="rounded-lg border">
          <LeftPanel exec={exec} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65}>
          <RightPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Page;
