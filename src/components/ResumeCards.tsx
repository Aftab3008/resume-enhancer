"use client";

import { Resume } from "@prisma/client";
import { Loader2 } from "lucide-react";
import ResumeCard from "./ResumeCard";

export function ResumeCards({ resumes }: { resumes: Resume[] }) {
  if (!resumes) {
    return (
      <div className="flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <ul className="w-full divide-y divide-gray-200 dark:divide-gray-700">
      {resumes.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}
    </ul>
  );
}
