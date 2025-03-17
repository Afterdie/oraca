import SQLEditor from "./SQLEditor";

import { SQLEditorProps } from "./SQLEditor";

const LeftPanel = ({ exec }: SQLEditorProps) => {
  return (
    <div className="h-full">
      <SQLEditor exec={exec} />
    </div>
  );
};

export default LeftPanel;
