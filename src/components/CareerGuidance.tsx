"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { careerSchema } from "@/lib/validators/schema";
import { Icons } from "@/components/ui/icons";
import remarkGfm from "remark-gfm";

type Message = {
  role: "system" | "user";
  content: string;
};

export function CareerGuidance() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const form = useForm({
    resolver: zodResolver(careerSchema),
    defaultValues: {
      academicPerformance: "",
      interests: "",
      skills: "",
      experience: "",
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: `**Academic**: ${data.academicPerformance}\n\n**Interests**: ${data.interests}\n\n**Skills**: ${data.skills}`,
      },
    ]);

    try {
      const response = await fetch("/api/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        aiResponse += chunk;

        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.role === "system") {
            return [
              ...prev.slice(0, -1),
              { role: "system", content: lastMessage.content + chunk },
            ];
          }
          return [...prev, { role: "system", content: chunk }];
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "Error generating recommendations. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[80vh] w-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Career Guidance Input</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="academicPerformance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Performance</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="BTech CSE GPA, university, courses, projects..."
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Interests</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Career goals, preferred roles, industries..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technical Skills</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Programming languages, frameworks, tools..."
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  "Get Career Guidance"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader>
          <CardTitle>AI Career Advisor</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    message.role === "user"
                      ? "bg-muted ml-auto w-3/4"
                      : "bg-background border w-full"
                  }`}
                >
                  {message.role === "system" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h2: ({ node, ...props }) => (
                          <h2
                            className="text-xl font-bold mt-6 mb-3 text-primary"
                            {...props}
                          />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="list-disc pl-6 space-y-2" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="text-base" {...props} />
                        ),
                        a: ({ node, ...props }) => (
                          <a
                            className="text-blue-600 hover:text-blue-800 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}


