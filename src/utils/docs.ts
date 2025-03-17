import { PartialBlock } from "@blocknote/core";
import { getSchema } from "./schema";

const blockNoteBlockTypes: PartialBlock[] = [
  {
    type: "table",
    content: {
      type: "tableContent",
      rows: [
        {
          cells: ["Column Names", "DataType"],
        },
        {
          cells: ["sampletable", "TEXT"],
        },
      ],
    },
  },
  { type: "heading", content: "", props: { level: 1 } },
  { type: "heading", content: "", props: { level: 2 } },
  { type: "heading", content: "", props: { level: 3 } },
  { type: "bulletListItem", content: "" },
  { type: "bulletListItem", content: "" },
  { type: "paragraph", content: "" },
  {
    type: "codeBlock",
    content: "SELECT * FROM table",
    props: { language: "sql" },
  },
];

const sqliteDataTypes = [
  { type: "NULL", description: "The value is a NULL value." },
  {
    type: "INTEGER",
    description:
      "The value is a signed integer, stored in 0, 1, 2, 3, 4, 6, or 8 bytes depending on the magnitude of the value.",
  },
  {
    type: "REAL",
    description:
      "The value is a floating point value, stored as an 8-byte IEEE floating point number.",
  },
  {
    type: "TEXT",
    description:
      "The value is a text string, stored using the database encoding (UTF-8, UTF-16BE or UTF-16LE).",
  },
  {
    type: "BLOB",
    description: "The value is a blob of data, stored exactly as it was input.",
  },
];

export const generateDocumentationFields = () => {
  const schema = JSON.stringify(getSchema(), null, 2);
  const datatypes = JSON.stringify(sqliteDataTypes, null, 2);
  const blocks = JSON.stringify(blockNoteBlockTypes, null, 2);

  return { schema: schema, datatypes: datatypes, blocks: blocks };
};
