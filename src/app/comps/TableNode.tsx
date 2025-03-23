import { Handle, Position } from "reactflow";

type TableNodeProps = {
  data: {
    label: string;
    fields: { name: string; type: string }[];
    stats?: { row_count: number };
  };
};

const TableNode: React.FC<TableNodeProps> = ({ data }) => {
  return (
    <div className="w-56 rounded-lg border border-gray-300 bg-white shadow-lg">
      {/* Table Name */}
      <div className="rounded-t-lg bg-blue-500 py-2 text-center font-bold text-white">
        {data.label} ({data.stats?.row_count ?? "N/A"} rows)
      </div>

      {/* Column List */}
      <div className="p-2">
        {data.fields.map((field, index) => (
          <div
            key={index}
            className="flex justify-between border-b px-2 py-1 last:border-none"
          >
            <span className="font-mono">{field.name}</span>
            <span className="text-gray-500">{field.type}</span>
          </div>
        ))}
      </div>

      {/* React Flow Handles */}
      <Handle
        type="source"
        position={Position.Right}
        className="h-2 w-2 bg-blue-500"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="h-2 w-2 bg-red-500"
      />
    </div>
  );
};

export default TableNode;
