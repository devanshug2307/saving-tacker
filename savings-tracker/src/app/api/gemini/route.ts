import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export async function POST(request: Request) {
  try {
    const { savingGoal } = await request.json();

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Generate a savings plan for the goal: ${savingGoal}. 
                Return the response in JSON format with these fields:
                - totalAmount (number)
                - numberOfDays (number between 30-100)
                - dailyAmount (number)
                - encouragingMessage (string)
                Example: {
                  "totalAmount": 1000, 
                  "numberOfDays": 50, 
                  "dailyAmount": 20,
                  "encouragingMessage": "That's a great goal! I'll help you save $1000 in 50 days."
                }`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get response from Gemini API");
    }

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response format from Gemini API");
    }

    const aiText = data.candidates[0].content.parts[0].text;
    const jsonMatch = aiText.match(/\{.*\}/s);
    if (!jsonMatch) {
      throw new Error("Could not find JSON in Gemini API response");
    }

    const planData = JSON.parse(jsonMatch[0]);
    return NextResponse.json(planData);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Failed to process saving goal",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
