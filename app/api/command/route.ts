import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { command } = await request.json();

    if (!command) {
      return NextResponse.json(
        { error: "Command is required" },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `
You are an AI project management command parser.

Understand the user's project management command and return ONLY valid JSON.

Supported intents:
CREATE_TASK
COMPLETE_TASK
LIST_TASKS
UPDATE_TASK
ASSIGN_TASK

Extract:
- task
- assignee
- status
- project

Return exactly this structure:

{
  "intent": "CREATE_TASK",
  "task": "Fix login bug",
  "assignee": "Ayushi",
  "status": null,
  "project": null
}

User command:
${command}
      `,
    });

    const result = response.text;

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process command",
      },
      { status: 500 }
    );
  }
}