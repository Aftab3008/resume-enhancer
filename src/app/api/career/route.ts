import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { academicData, interests, skills } = await req.json();

  try {
    const stream = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a career guidance expert with deep knowledge of current job market trends. Analyze this student profile:
            Academic: ${academicData}
            Interests: ${interests}
            Skills: ${skills}
            
            Provide recommendations in markdown format with these sections:
            ## Current Market Trends
            - Overview of relevant industry trends
            - In-demand skills for the next 2-3 years
            - Emerging roles/technologies
            
            ## Career Paths
            - 3-5 roles aligned with trends and profile
            - Growth potential for each path
            - Required trend-aligned skills
            
            ## Recommended Courses
            - Links to courses using [Name](URL) format
            - Focus on trending technologies
            - Include emerging skill certifications
            
            ## Skill Development
            - Actionable steps with specific technologies
            - Trending tools/frameworks to learn
            - Industry-relevant project ideas
            
            Use proper markdown formatting without code blocks. Reference recent trends and include salary ranges where appropriate.`,
        },
      ],
      model: "mixtral-8x7b-32768",
      stream: true,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
