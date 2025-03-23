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
import { toast } from "sonner";

//comps
import LeftPanel from "../comps/LeftPanel";
import RightPanel from "../comps/RightPanel";

export interface ConfigTypes {
  provider: string;
  connection_string: string | null;
}
const Page = () => {
  const router = useRouter();
  const [db, setDB] = useState<Database | null>(null);
  //const [loading, setLoading] = useState(false);
  //const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();

  const [config, setConfig] = useState<ConfigTypes>({
    connection_string: null,
    provider: "",
  });

  //conditionally setup db is the config says local
  useEffect(() => {
    //incase the connection string does not exist send user back to connect page
    const storedConfig = sessionStorage.getItem("config");
    if (!storedConfig) {
      router.push("/connect");
      return;
    }

    const config = JSON.parse(storedConfig);
    setConfig(config);

    if (!config.connection_string) {
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

  //if i add connectors then only this needs to be modified
  const handleExecuteQuery = async (query: string): Promise<void> => {
    if (!query.trim()) return;
    //prevent default
    const result = await executeQuery(
      query,
      config.connection_string ? null : db,
      config.connection_string,
    );

    if (result.success && result.data && result.duration) {
      dispatch(updateResult({ value: result.data, duration: result.duration }));
    } else {
      toast.error(result.error || "Failed to execute Query");
    }
  };

  return (
    <div className="relative h-screen w-screen">
      <div className="absolute h-full w-full p-2">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={35} className="mr-[3px] rounded-lg">
            <LeftPanel exec={handleExecuteQuery} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={65} className="ml-[3px]">
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
