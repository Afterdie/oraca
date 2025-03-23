"use client";

import React, { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  { id: "1", position: { x: 250, y: 5 }, data: { label: "Node 1" } },
  { id: "2", position: { x: 100, y: 100 }, data: { label: "Node 2" } },
  { id: "3", position: { x: 400, y: 200 }, data: { label: "Node 3" } },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const SchemaFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
