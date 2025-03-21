import SQLEditor from "./SQLEditor";
import { Card, CardContent } from "@/components/ui/card";

import { SQLEditorProps } from "./SQLEditor";

const LeftPanel = ({ exec }: SQLEditorProps) => {
  return (
    <Card className="h-full p-2">
      <CardContent className="p-0">
        <SQLEditor exec={exec} />
      </CardContent>
    </Card>
  );
};

export default LeftPanel;
