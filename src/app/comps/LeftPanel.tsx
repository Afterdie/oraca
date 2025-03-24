import SQLEditor from "./SQLEditor";
import { Card, CardContent } from "@/components/ui/card";

const LeftPanel = () => {
  return (
    <Card className="h-full p-2">
      <CardContent className="p-0">
        <SQLEditor />
      </CardContent>
    </Card>
  );
};

export default LeftPanel;
