import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  Node,
  Edge,
} from "reactflow";
import TableNode from "../TableNode";
import "reactflow/dist/style.css";
import { Metadata } from "@/utils/metadata";
import processSchemaToFlow from "@/utils/flow";
import { RootState } from "@/store/store";

const nodeTypes = { tableNode: TableNode }; // Register custom node

const SchemaFlow = () => {
  const metadata: Metadata = useSelector(
    (state: RootState) => state.schemaUpdate.value,
  );

  const { nodes, edges }: { nodes: Node[]; edges: Edge[] } = useMemo(
    () => processSchemaToFlow(metadata),
    [metadata],
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        //onNodesChange={onNodesChange}
        //onEdgesChange={onEdgesChange}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Controls className="opacity-30 transition-all duration-300 ease-in-out hover:opacity-100" />
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage:
              "radial-gradient(circle, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)",
            maskImage:
              "radial-gradient(circle, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)",
          }}
        >
          <Background
            color="white"
            variant={BackgroundVariant.Dots}
            size={1}
            gap={15}
            className="relative"
          />
        </div>
        {/* Radial gradient fade effect */}
      </ReactFlow>
    </div>
  );
};

export default SchemaFlow;
