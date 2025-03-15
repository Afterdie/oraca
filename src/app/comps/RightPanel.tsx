import Result from "./Result";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BlockEditor from "./BlockEditor";

export default function RightPanel() {
  return (
    <div className="h-full w-full pl-2">
      <Tabs defaultValue="result" className="h-full w-full">
        <TabsList>
          <TabsTrigger value="result">Result</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
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
