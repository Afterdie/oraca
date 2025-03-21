"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateResult } from "@/store/store";

//util
import { initDB, executeQuery } from "@/utils/sqlEngine";

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
  //const [loading, setLoading] = useState(false);
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
  }, [router]);

  interface config {
    provider: string;
    connection_string: string | null;
  }
  //if i add connectors then only this needs to be modified
  const handleExecuteQuery = async (value: string): Promise<void> => {
    if (!value.trim()) return;
    //prevent default
    const storedConfig = sessionStorage.getItem("config");
    if (!storedConfig) {
      router.push("/connect");
      return;
    }
    //checks which request local or connection
    const config: config = JSON.parse(storedConfig);

    let result;
    if (config.provider === "local") {
      if (!db) return; //cna show a modal here
      result = await executeQuery(value, db, null);
    } else {
      if (!config.connection_string) return;
      result = await executeQuery(value, null, config.connection_string);
    }
    //const processedSchema = processSchema(result.schema[0]);
    if (result.success) {
      if (!result.data || !result.duration) return;
      const data = result.data;
      dispatch(updateResult({ value: data, duration: result.duration }));
      console.log(data, value);
    } else {
      //show a toast about failuer
      console.error(result.error);
    }
  };

  return (
    <div className="relative h-screen w-screen">
      <div className="absolute h-full w-full p-2">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={35} className="mr-2 rounded-lg border">
            <LeftPanel exec={handleExecuteQuery} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={65} className="ml-2">
            <RightPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-[-1] h-full w-full object-cover"
        src="/bg.webm"
      ></video>
    </div>
  );
};

export default Page;
