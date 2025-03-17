import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import ShowResumeContent from "./ShowResumeContent";

export default function ShowResume() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <ShowResumeContent />
    </Suspense>
  );
}
