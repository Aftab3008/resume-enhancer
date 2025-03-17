import { getUserResume } from "@/lib/actions/resume.actions";
import { ResumeCards } from "./ResumeCards";

export default async function ShowResumeContent() {
  const resumes = await getUserResume();

  if (!resumes) {
    return <div>No resumes found</div>;
  }

  return <ResumeCards resumes={resumes} />;
}
