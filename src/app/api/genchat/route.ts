import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse, NextRequest } from "next/server";

const API_KEY = process.env.GEMINI_API_KEY;

export const POST = async (req: NextRequest) => {
  const { prompt } = await req.json();
  if (!prompt || !API_KEY) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }
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
  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
};
