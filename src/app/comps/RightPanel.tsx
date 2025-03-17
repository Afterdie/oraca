"use client";
//theres absolutely no need for using use client here smh
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Docs from "./tabs/Docs";
import Result from "./tabs/Result";
import TextInput from "./TextInput";
import { useState } from "react";
import Conversation from "./tabs/Conversation";

export default function RightPanel() {
  const [value, setValue] = useState("result");

  return (
    //conditionally set this relative style
    <div className={`${value === "chat" ? "relative" : ""} h-full pl-2`}>
      {/* <div className="absolute bottom-0 left-0 flex w-full justify-center">
        <TextInput />
      </div> */}
      <Tabs defaultValue="result" className="h-full" onValueChange={setValue}>
        <TabsList>
          <TabsTrigger value="result">Result</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
          <TabsTrigger value="vis">Visualize</TabsTrigger>
          <TabsTrigger value="chat">Conversation</TabsTrigger>
        </TabsList>
        <TabsContent value="result" className="grow">
          <Result />
        </TabsContent>
        <TabsContent value="docs" className="min-h-0 grow">
          <Docs />
        </TabsContent>
        <TabsContent value="chat" className="grow">
          <Conversation />
        </TabsContent>
      </Tabs>
    </div>
  );
}
