import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Docs from "./tabs/Docs";
import Result from "./tabs/Result";
import Conversation from "./tabs/Conversation";

const RightPanel = () => {
  return (
    //conditionally set this relative style
    <div className="h-full pl-2">
      {/* 
        this looks very obnoxious moving it to conversation only
      <div className="absolute bottom-0 left-0 flex w-full justify-center">
        <TextInput />
      </div> */}
      <Tabs defaultValue="chat" className="h-full">
        <TabsList>
          <TabsTrigger value="result">Result</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
          <TabsTrigger value="vis">Visualize</TabsTrigger>
          <TabsTrigger value="chat">Conversation</TabsTrigger>
        </TabsList>
        <TabsContent value="result" className="min-h-0 grow">
          <Result />
        </TabsContent>
        <TabsContent value="docs" className="min-h-0 grow">
          <Docs />
        </TabsContent>
        <TabsContent value="chat" className="min-h-0 grow">
          <Conversation />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RightPanel;
