import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse, NextRequest } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY;

export const POST = async (req: NextRequest) => {
  const { schema, datatypes, blocks } = await req.json();
  if (!schema || !datatypes || !blocks || !API_KEY) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const schemaJSON = JSON.stringify(schema, null, 2);
  const datatypesJSON = JSON.stringify(datatypes, null, 2);
  const blocksJSON = JSON.stringify(blocks, null, 2);
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
  ${schemaJSON}
  
  Supported Data Types
  ${datatypesJSON}
  
  Allowed Block Types (Use only these, no others)
  ${blocksJSON}
  
  Important: If a required structure cannot be represented using the allowed block types, do not attempt to create new block types—strictly use only what is provided. If a concept cannot be documented using the available blocks, omit it instead of introducing new ones.`;

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([prompt]);

    if (result && result.response) {
      const generatedText = await result.response.text();
      return NextResponse.json({ docs: generatedText });
    } else {
      throw new Error("No response received from model.");
    }
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error }, { status: 500 });
    else return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
};
