import SQLEditor from "./SQLEditor";

import { SQLEditorProps } from "./SQLEditor";

export default function LeftPanel({ exec }: SQLEditorProps) {
  return (
    <div className="h-full">
      <SQLEditor exec={exec} />
    </div>
  );
}
