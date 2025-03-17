"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { enhanceResume } from "@/lib/actions/enhancement.actions";
import { useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2 } from "lucide-react";

export function EnhancementPanel({ resumeData }: { resumeData: any }) {
  const [jobDescription, setJobDescription] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnhance = async () => {
    try {
      setLoading(true);
      const result = await enhanceResume({
        resume: resumeData,
        jobDescription,
      });

      setSuggestions(result.suggestions as string);
    } catch (error) {
      toast("Enhancement failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <h2 className="text-xl font-bold">Resume Enhancer</h2>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <Textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here"
          className="h-40"
        />
        <Button
          onClick={handleEnhance}
          disabled={loading}
          className="cursor-pointer"
        >
          {loading ? (
            <div className="flex gap-2 items-center">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Enhancing...</span>
            </div>
          ) : (
            "Enhance Resume"
          )}
        </Button>

        {suggestions && (
          <ScrollArea className="flex-1 border rounded-lg p-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ node, ...props }) => (
                  <h2
                    className="text-xl font-bold mt-4 mb-2 text-primary"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    className="text-lg font-semibold mt-3 mb-1.5"
                    {...props}
                  />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-6 space-y-2" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-base" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-medium" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a className="text-blue-600 hover:underline" {...props} />
                ),
                p: ({ node, ...props }) => <p className="mb-2" {...props} />,
              }}
            >
              {suggestions}
            </ReactMarkdown>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
