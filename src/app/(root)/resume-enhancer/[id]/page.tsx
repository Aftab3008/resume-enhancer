import { ResumeContent } from "@/components/ResumeContent";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
        </div>
      }
    >
      <ResumeContent id={id} />
    </Suspense>
  );
}
