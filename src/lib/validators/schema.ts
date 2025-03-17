import { z } from "zod";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/constants";

export const careerSchema = z.object({
  academicPerformance: z.string().min(1, "Academic info required"),
  interests: z.string().min(1, "Interests required"),
  skills: z.string().min(1, "Skills required"),
  experience: z.string().optional(),
});

export const FormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  linkedin: z.string().url("Invalid LinkedIn URL"),
  resume: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "File size must be less than 5MB"
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Invalid file type"
    ),
  skills: z.optional(z.string()),
  experience: z.optional(z.string()),
});
