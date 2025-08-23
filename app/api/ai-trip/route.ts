// app/api/aitrip/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { destination, startDate, endDate, interests } = await req.json();

    const prompt = `
      You are a travel planner.
      Respond ONLY with valid JSON and nothing else.
      The JSON must strictly follow this format:
      {
        "destination": string,
        "startDate": string,
        "endDate": string,  
        "itinerary": [
          {
            "day": number,
            "title": string,
            "activities": string[]
          }
        ]
      }

      Important instructions:
      - If a day includes multiple locations in the title, use '&' between them, NOT the word 'and'.
      - Do NOT add extra text outside of the JSON.
      - Keep titles concise.
      Fill it for:
      Destination: ${destination}
      Dates: ${startDate} to ${endDate}
      Interests: ${interests}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    let planText = result.response.text() || "";

    // Remove code block markers and trim
    planText = planText.replace(/```(json)?/g, "").trim();

    // Attempt to extract JSON part if extra text exists
    const jsonMatch = planText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON object found in AI response");
    }

    const plan = JSON.parse(jsonMatch[0]);

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Trip plan generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate trip plan" },
      { status: 500 }
    );
  }
}
