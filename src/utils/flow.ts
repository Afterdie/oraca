import { Edge, Node } from "reactflow";
import {
  Metadata,
  TableSchema,
  ForeignKeySchema,
  RelationshipSchema,
} from "./metadata";

const processSchemaToFlow = (
  metadata: Metadata,
): { nodes: Node[]; edges: Edge[] } => {
  if (!metadata || !metadata.local_schema) return { nodes: [], edges: [] };

  const nodes: Node[] = Object.entries<TableSchema>(metadata.local_schema).map(
    ([tableName, tableData], index) => ({
      id: tableName,
      position: { x: 200 * index, y: 100 + (index % 2) * 200 }, // Spread out nodes
      data: {
        label: tableName,
        fields: tableData.columns, // Pass column data
        stats: metadata.stats[tableName], // Pass table stats
      },
      type: "tableNode", // Custom node type
    }),
  );

  const edges: Edge[] = [];

  Object.entries<TableSchema>(metadata.local_schema).forEach(
    ([tableName, tableData]) => {
      // Process foreign keys
      tableData.foreign_keys.forEach((fk: ForeignKeySchema) => {
        edges.push({
          id: `e${tableName}-${fk.references_table}`,
          source: tableName,
          target: fk.references_table, // Connect to referenced table
          label: `${fk.column.join(", ")} → ${fk.referenced_column.join(", ")}`, // Show FK mapping
          type: "smoothstep",
        });
      });

      // Process relationships
      tableData.relationships.forEach((rel: RelationshipSchema) => {
        edges.push({
          id: `r${rel.from_table}-${rel.to_table}`,
          source: rel.from_table,
          target: rel.to_table,
          label: `${rel.from_columns.join(", ")} → ${rel.to_columns.join(", ")}`,
          type: "step",
        });
      });
    },
  );

  return { nodes, edges };
};

export default processSchemaToFlow;
