import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse, NextRequest } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: NextRequest) {
  const { description, DB_SCHEMA } = await req.json();
  if (!description || !DB_SCHEMA || !API_KEY) {
    return NextResponse.json(
      { error: "Description is required." },
      { status: 400 },
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    //write the whole system prompt here
    //needs to be tweaked
    const prompt = `You are an AI specialized in converting natural language to strict SQLite queries.

    Database Schema:
    ${DB_SCHEMA}

    Rules:
    - Follow the schema exactly.
    - Use only valid SQLite syntax.
    - Never generate fields or tables that don't exist.

    Example Queries:
    User Input: Show me all users who placed an order over $50.
    SQL Output:
    SELECT users.id, users.name FROM users JOIN orders ON users.id = orders.user_id WHERE orders.amount > 50;`;

    const result = await model.generateContent([prompt]);

    if (result && result.response) {
      const generatedText = await result.response.text();
      return NextResponse.json({ query: generatedText });
    } else {
      throw new Error("No response received from model.");
    }
  } catch (error) {
    console.error("Error generating Query:", error);
    return NextResponse.json(
      { error: "Failed to generate query" },
      { status: 500 },
    );
  }
}
