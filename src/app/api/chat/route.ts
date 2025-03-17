import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse, NextRequest } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY;

export const POST = async (req: NextRequest) => {
  const { schema, userInput, query } = await req.json();
  if (!schema || !userInput || !API_KEY) {
    return NextResponse.json(
      { error: "Details are required" },
      { status: 400 },
    );
  }

  try {
    const schemaJSON = JSON.stringify(schema, null, 2);
    const withQuery = `You are an SQL assistant named Oraca specialized in SQLite. The user provides an SQL query along with a request for modifications, explanations, or optimizations.

    ## Context:
    - Database schema: ${schemaJSON}
    - Always use **SQLite syntax**.
    - If the query references nonexistent tables or columns, inform the user instead of assuming.
    - Ensure queries are **correct, efficient, and safe**.
    
    ## Response Types:
    1. **Modify Query**: Adjust queries based on the user's request (e.g., add filters, change sorting).
    2. **Explain Query**: Break down what a query does in simple terms.
    3. **Optimize Query**: Improve efficiency while keeping it functionally correct.
    
    ## Rules:
    - **Strictly follow the provided schema**.
    - **Warn before generating unsafe queries** (e.g., DELETE without WHERE).
    - **Be clear, concise, and provide only necessary modifications**.
    
    User Query: ${query}  
    User Request: ${userInput}
    `;

    const withoutQuery = `You are an SQL assistant named Oraca specialized in SQLite. Help users by explaining database concepts, describing tables, and generating valid queries based on the provided schema.

    ## Context:
    - Database schema: ${schemaJSON}
    - Always use SQLite syntax.
    - Generate placeholder queries if the user does not give you the exact values.
    - If a table or column is missing, inform the user instead of assuming.
    - Provide clear explanations, table details, or optimized queries based on the request.
    - Ask for clarification if the request is vague.

    ## Response Types:
    1. Explanations: Explain SQL concepts and best practices.
    2. Table Details: List columns and types when asked about a table.
    3. SQL Queries: Generate optimized SQLite queries.

    ## Rules:
    - Do not use any sort of formatting respond with plain text ONLY.
    - Use only the provided schema.
    - Warn before generating unsafe queries (e.g., DELETE without WHERE).
    - Keep responses precise, helpful, and conversational.

    User Input: ${userInput}
    `;

    const prompt = query ? withQuery : withoutQuery;

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([prompt]);

    if (result && result.response) {
      const generatedText = await result.response.text();
      return NextResponse.json({ reply: generatedText });
    } else {
      throw new Error("No response received from model.");
    }
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error }, { status: 500 });
    else return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
};
