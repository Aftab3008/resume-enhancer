"use server";

import Groq from "groq-sdk";
import { z } from "zod";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const EnhanceSchema = z.object({
  resume: z.any(),
  jobDescription: z.string().min(50),
});

export async function enhanceResume(params: z.infer<typeof EnhanceSchema>) {
  try {
    const { resume, jobDescription } = EnhanceSchema.parse(params);

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Analyze this resume against the job description using this strict format:
      
      # Resume Enhancement Report
      
      ## Key Action Items (Prioritized)
      1. [Critical] Add missing JD requirement: "[Exact quoted phrase]" 
         - Insert in: [Resume section]
         - Suggested wording: "[JD-aligned phrase]"
      
      ## JD Keyword Integration
      | JD Keyword       | Found? | Insertion Points | Example Phrase                  |
      |------------------|--------|------------------|---------------------------------|
      | "[JD keyword 1]" | [Yes/No] | [Section]       | "[Example]"                     |
      
      ## Skill Alignment Matrix
      - Match: "[Resume Skill]" ↔ "[JD Skill]"
      - Gap: "[Missing Skill]" → Add to [Section]
      
      ## Ready-to-Use Content Blocks
      \`\`\`
      1. "[JD Verb] [metric] using [JD Tech]"
      \`\`\`
      
      ## Project-Specific Enhancements
      ### [Project 1 Name from Resume]
      **Original:**  
      "[Exact project description]"  
      
      **Enhanced:**  
      "[Improved version with JD keywords]"  
      *Changes:*  
      - Added "[JD keyword]" from JD Line [X]  
      - Included "[JD metric]" from "[JD section]"  
      
      ### [Project 2 Name from Resume]
      **Original:**  
      "[Exact project description]"  
      
      **Enhanced:**  
      "[Improved version with JD requirements]"  
      *Changes:*  
      - Added "[JD tool]" from JD's "[section]"  
      - Used "[JD verb]" from requirements  
      
      <Resume>
      ${JSON.stringify(resume, null, 2)}
      </Resume>
      
      <JobDescription>
      ${jobDescription}
      </JobDescription>
      
      Rules:
      1. Keep project enhancements as last section
      2. Enhance ALL resume projects
      3. Use actual project names/descriptions
      4. Highlight JD references in changes
      5. Maintain original project scope`,
        },
      ],
      model: "llama3-70b-8192",
      temperature: 0.2,
      max_tokens: 4096,
      stream: false,
    });
    return {
      suggestions: completion.choices[0].message.content,
    };
  } catch (error) {
    throw new Error("Enhancement failed: ");
  }
}
