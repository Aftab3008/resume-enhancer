"use server";

import { currentUser } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import prisma from "../db/prisma";
import { revalidatePath } from "next/cache";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function evaluateResume(formData: FormData) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("User not found");

    const clerkId = user.id;
    const resumeFile = formData.get("file") as File;
    const parseFormData = new FormData();
    parseFormData.append("file", resumeFile);

    const parseRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/parse-pdf`,
      { method: "POST", body: parseFormData }
    );

    if (!parseRes.ok) throw new Error("PDF parsing failed");

    const { text, metadata } = await parseRes.json();

    const systemMessage = `Analyze the resume text and extract structured JSON. Follow these rules:
1. For experience/project bullet points:
   - Capture all lines starting with •, ⦿, or *
   - Keep verb tense consistent
   - Preserve technical terminology
2. Format responsibilities as arrays
3. Handle multi-line bullet points
4. Example project format:
{
  "projects": [
    {
      "name": "Authify",
      "description": "October 2024 - November 2024",
      "technologies": ["MERN", "MAILTRAP", "Vite", "ExpressJS", "Tailwind CSS", "Framer Motion"],
      "description": [
        "Built email verification and login template with MAILTRAP integration",
        "Created stylish template using Vite, ExpressJS and Tailwind CSS",
        "Implemented smooth animations with Framer Motion"
      ]
    }
  ]
}

JSON structure:
{
  "contact_info": {
    "name": "[Full Name]",
    "email": "[Email Address]",
    "phone": "[Phone Number]",
    "location": "[City, State]",
    "linkedin": "[LinkedIn URL]",
    "portfolio": "[Portfolio/Website URL]"
  },
  "skills": ["technical", "skills"],
  "education": [
    {
      "degree": "[Degree]",
      "institution": "[University]",
      "dates": "[MM/YYYY - MM/YYYY]",
      "gpa": "[GPA]"
    }
  ],
  "experience": [
    {
      "title": "[Job Title]",
      "company": "[Company]",
      "dates": "[MM/YYYY - MM/YYYY]",
      "responsibilities": ["bullet points"]
    }
  ],
  "certifications": ["certifications"],
  "projects": [
    {
      "name": "[Project Name]",
      "description": "[bullet points]",
      "technologies": ["technologies"],
    }
  ],
  "languages": ["languages"]
}

Rules:
1. Return null for missing fields
2. Dates in MM/YYYY format
3. Extract only verified information
4. Prioritize technical skills
5. Ignore irrelevant text
6. Maintain original capitalization

Resume Text:
${text}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "system", content: systemMessage }],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      stream: false,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;

    if (content) {
      const resumeJson = JSON.parse(content);
      const newResume = await prisma.resume.create({
        data: {
          clerkId,
          resume: resumeJson,
          fileName: resumeFile.name,
        },
      });

      revalidatePath("/resume-enhancer");

      return newResume ? JSON.stringify(newResume) : null;
    }
    throw new Error("Failed to extract resume information");
  } catch (error) {
    console.error(error);
    throw error;
  }
}
