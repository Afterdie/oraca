"use client";
//theres absolutely no need for using use client here smh
import Result from "./Result";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BlockEditor from "./BlockEditor";
import TextInput from "./TextInput";
import { useState } from "react";

export default function RightPanel() {
  const [value, setValue] = useState("result");

  return (
    //conditionally set this relative style
    <div className={`${value === "chat" ? "relative" : ""} h-full pl-2`}>
      <div className="absolute bottom-0 left-0 flex w-full justify-center">
        <TextInput />
      </div>
      <Tabs
        defaultValue="result"
        className="h-full w-full"
        onValueChange={setValue}
      >
        <TabsList>
          <TabsTrigger value="result">Result</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
          <TabsTrigger value="vis">Visualize</TabsTrigger>
          <TabsTrigger value="chat">Conversation</TabsTrigger>
        </TabsList>
        <TabsContent value="result" className="h-full w-full">
          <Card className="h-full w-full gap-2">
            <CardHeader>
              <CardTitle>Queried Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Result />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="docs" className="h-full w-full">
          <Card className="h-full w-full gap-2 p-0">
            <CardContent className="p-2">
              <BlockEditor />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
