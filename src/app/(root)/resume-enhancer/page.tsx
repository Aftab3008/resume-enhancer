import AddResume from "@/components/AddResume";
import ShowResume from "@/components/ShowResume";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function page() {
  return (
    <div className="min-h-screen flex flex-col pt-24 pb-8 md:pt-32">
      <div className="container max-w-4xl mx-auto px-4 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Your List of Resumes
          </h1>
          <div className="flex gap-4">
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700 text-white hover:cursor-pointer"
            >
              <Link href="/career-guidance">Career Guidance</Link>
            </Button>
            <AddResume />
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 flex-1">
        <ShowResume />
      </div>
    </div>
  );
}
