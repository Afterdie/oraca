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

export const generateDocumentationPrompt = () => {
  const schema = JSON.stringify(getSchema(), null, 2);
  const datatypes = JSON.stringify(sqliteDataTypes, null, 2);
  const blocks = JSON.stringify(blockNoteBlockTypes, null, 2);

  const prompt = `
  You are an AI specialized in generating structured database documentation in strict compliance with the BlockNote block format. Your task is to produce industry-standard documentation explaining all fields of the table and general information, while adhering to the provided schema, supported data types, and explicitly allowed block types. Also include a few sample queries in the code block for each table and write the explanations for these queries in a paragraph block. When you wish to add gap between two topics and two sql queries simply use an empty paragraph block.

  Rules & Constraints
  - Output must be a valid JSON object strictly following the BlockNote block format.
  - Do not generate or include any block types other than those explicitly provided.
  - Do not introduce extra fields beyond those defined in the schema.
  - Ensure all data types match the supported data types
  - Do not introduce extra data types beyond those defined in the supported data types
  - There is no datatype for DATE use TEXT instead
  - Maintain readability and logical structuring while staying within BlockNote's JSON format.
  - Your response must contain JSON only.
  
  Provided Information
  Schema
  ${schema}
  
  Supported Data Types
  ${datatypes}
  
  Allowed Block Types (Use only these, no others)
  ${blocks}
  
  Important: If a required structure cannot be represented using the allowed block types, do not attempt to create new block types—strictly use only what is provided. If a concept cannot be documented using the available blocks, omit it instead of introducing new ones.`;
  return prompt;
};
