"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

//shadcn
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

//comps
import LeftPanel from "../comps/LeftPanel";
import RightPanel from "../comps/RightPanel";

export interface ConfigTypes {
  provider: string;
  connection_string: string | null;
}
const Page = () => {
  const router = useRouter();

  //conditionally setup db is the config says local
  useEffect(() => {
    //incase the connection string does not exist send user back to connect page
    const storedConfig = sessionStorage.getItem("config");
    if (!storedConfig) {
      router.push("/");
      return;
    }
  }, [router]);

  return (
    <div className="relative h-screen w-screen">
      <div className="absolute h-full w-full p-2">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={35} className="mr-[3px] rounded-lg">
            <LeftPanel />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={65} className="ml-[3px]">
            <RightPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Page;
