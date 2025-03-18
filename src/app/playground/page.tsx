"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [db, setDB] = useState<Database | null>(null);
  //const [loading, setLoading] = useState(true);
  //const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  //conditionally setup db is the config says local
  useEffect(() => {

    //incase the connection string does not exist send user back to connect page
    const storedConfig = sessionStorage.getItem("config");
    if (!storedConfig) {
      router.push("/connect");
      return;
    }

    const config = JSON.parse(storedConfig);

    if (config.provider === "local") {
      async function setupDB() {
        try {
          const d = await initDB();
          setDB(d);
        } catch (e) {
          console.error("Failed to initialize database:", e);
        }
      }
      setupDB();
    }
  }, []);

  //if i add connectors then only this needs to be modified
  const exec = (value: string): void => {
    const trimmedValue = value.trim();

    //two possible cases local execution and connected db
    const storedConfig = sessionStorage.getItem("config");
    if (!storedConfig) {
      //handle with a toast
      return;
    }
    const config = JSON.parse(storedConfig);

    if (config.provider == "local") {
      if (trimmedValue == "" || !db) return;

      //generates the result for local db
      const result = executeQuery(db, trimmedValue);

      if (result.success) {
        if (!result.data || !result.duration || !result.schema) return;
        const processedSchema = processSchema(result.schema[0]);
        dispatch(
          updateResult({ value: result.data, duration: result.duration }),
        );
        //when dispatching for store directlly store the process results
        dispatch(updateSchema(processedSchema));
        setSchema(processedSchema);
        return;
      }
    } else {
      //do something
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
