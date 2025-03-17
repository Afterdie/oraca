import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse, NextRequest } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  const { description, dbSchema } = await req.json();
  if (!description || !dbSchema || !API_KEY) {
    return NextResponse.json(
      { error: "Description and Schema are required" },
      { status: 400 },
    );
  }
  try {
    const schema = JSON.stringify(dbSchema, null, 2);
    const prompt = `You are an AI specialized in converting natural language to strict SQLite queries.

    Database Schema:
    ${schema}

    Rules:
    - Follow the schema exactly.
    - Use only valid SQLite syntax.
    - Do not put formatting back tics or language name in the reponse

    Example Querie:
    User Input: Show me all users who placed an order over $50.
    SQL Output:
    SELECT users.id, users.name FROM users JOIN orders ON users.id = orders.user_id WHERE orders.amount > 50;
    
    User Input: ${description}
    Generate SQL Output for this following the given rules and DO NOT PUT FORMATTING ON THE ANSWER.
    `;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([prompt]);

    if (result && result.response) {
      const generatedText = await result.response.text();
      return NextResponse.json({ query: generatedText });
    } else {
      throw new Error("No response received from model.");
    }
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error }, { status: 500 });
    else return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
