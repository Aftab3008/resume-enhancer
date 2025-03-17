"use client";
import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import { z } from "zod";
import jsPDF from "jspdf";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const ResumeDataSchema = z
  .object({
    contact_info: z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string(),
      location: z.string().nullable().optional().default(""),
      linkedin: z.string().nullable().optional().default(""),
      portfolio: z.string().nullable().optional().default(""),
    }),
    skills: z.array(z.string()).nullable().default([]),
    education: z
      .array(
        z.object({
          degree: z.string(),
          institution: z.string(),
          dates: z.string(),
          gpa: z.string().nullable().optional().default(""),
        })
      )
      .nullable()
      .default([]),
    experience: z
      .array(
        z.object({
          title: z.string(),
          company: z.string(),
          dates: z.string(),
          responsibilities: z
            .array(z.string())
            .nullable()
            .optional()
            .default([]),
        })
      )
      .nullable()
      .default([]),
    certifications: z.array(z.string()).nullable().optional().default([]),
    projects: z
      .array(
        z.object({
          name: z.string(),
          description: z.array(z.string()).nullable().optional().default([]),
          technologies: z.array(z.string()).nullable().optional().default([]),
        })
      )
      .nullable()
      .default([]),
    languages: z.array(z.string()).nullable().optional().default([]),
  })
  .transform((data) => ({
    // Transform null arrays to empty arrays
    ...data,
    skills: data.skills || [],
    education: data.education || [],
    experience: data.experience || [],
    projects: data.projects || [],
    certifications: data.certifications || [],
    languages: data.languages || [],
  }));

type ResumeData = z.infer<typeof ResumeDataSchema>;

const jsonToMarkdown = (data: unknown): string => {
  const parseResult = ResumeDataSchema.safeParse(data);

  if (!parseResult.success) {
    return "# Invalid Resume Format";
  }

  const validData = parseResult.data;
  let md = "";

  // Contact Information
  const { contact_info } = validData;
  md += `# ${contact_info.name}\n\n`;
  md += `**Email:** ${contact_info.email}\n`;
  md += `**Phone:** ${contact_info.phone}\n`;
  if (contact_info.location) md += `**Location:** ${contact_info.location}\n`;
  if (contact_info.linkedin) md += `**LinkedIn:** ${contact_info.linkedin}\n`;
  if (contact_info.portfolio)
    md += `**Portfolio:** ${contact_info.portfolio}\n`;
  md += "\n";

  // Skills
  if (validData.skills?.length) {
    md += "## Skills\n\n";
    validData.skills.forEach((skill) => (md += `- ${skill}\n`));
    md += "\n";
  }

  // Education
  if (validData.education?.length) {
    md += "## Education\n\n";
    validData.education.forEach((edu) => {
      md += `### ${edu.degree}\n`;
      md += `**Institution:** ${edu.institution}\n`;
      md += `**Dates:** ${edu.dates}\n`;
      if (edu.gpa) md += `**GPA:** ${edu.gpa}\n`;
      md += "\n";
    });
  }

  // Experience
  if (validData.experience?.length) {
    md += "## Experience\n\n";
    validData.experience.forEach((exp) => {
      md += `### ${exp.title}\n`;
      md += `**Company:** ${exp.company}\n`;
      md += `**Dates:** ${exp.dates}\n`;
      if (exp.responsibilities?.length) {
        md += "**Responsibilities:**\n";
        exp.responsibilities.forEach((resp) => (md += `- ${resp}\n`));
      }
      md += "\n";
    });
  }

  // Projects
  if (validData.projects?.length) {
    md += "## Projects\n\n";
    validData.projects.forEach((project) => {
      md += `### ${project.name}\n`;

      // Add description bullets
      if (project.description?.length) {
        project.description.forEach((desc) => (md += `- ${desc}\n`));
      }

      // Add technologies
      if (project.technologies?.length) {
        md += "\n**Technologies:**\n";
        project.technologies.forEach((tech) => (md += `- ${tech}\n`));
      }
      md += "\n";
    });
  }

  return md;
};

interface ResumeEditorProps {
  resumeData: unknown;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({ resumeData }) => {
  const [value, setValue] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit");
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const initialMarkdown = jsonToMarkdown(resumeData);
      setValue(initialMarkdown);
    } catch (error) {
      console.error("Error initializing editor:", error);
      setValue("# Error loading resume data");
    }
  }, [resumeData]);

  const handleDownload = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const lineHeight = 7;
      let verticalPosition = margin;

      // Set default font styles
      pdf.setFont("helvetica");
      pdf.setFontSize(11);

      // Configure text styling
      const addText = (
        text: string,
        fontSize: number,
        isBold: boolean = false,
        marginLeft: number = margin
      ) => {
        pdf.setFontSize(fontSize);
        pdf.setFont("helvetica", isBold ? "bold" : "normal");
        const lines = pdf.splitTextToSize(
          text,
          pageWidth - marginLeft - margin
        );
        lines.forEach((line: string) => {
          if (
            verticalPosition + lineHeight >
            pdf.internal.pageSize.getHeight() - margin
          ) {
            pdf.addPage();
            verticalPosition = margin;
          }
          pdf.text(line, marginLeft, verticalPosition);
          verticalPosition += lineHeight;
        });
      };

      // Add section headings
      const addSectionHeading = (text: string) => {
        addText(text, 13, true);
        verticalPosition += 3; // Add small space after heading
      };

      // Parse contact information
      const contactLines = value
        .split("\n")
        .slice(0, 5)
        .filter((l) => l.trim());
      const name = contactLines[0].replace("#", "").trim();
      const contactInfo = contactLines
        .slice(1)
        .map((line) => line.replace(/\*\*/g, "").replace(":", ""));

      // Add header section
      addText(name, 16, true, margin);
      verticalPosition += 4;
      contactInfo.forEach((line) => {
        addText(line, 11, false, margin);
        verticalPosition += 1;
      });
      verticalPosition += 8;

      // Process main content
      const sections = value.split("## ").slice(1); // Skip contact info

      sections.forEach((section) => {
        const [heading, ...content] = section.split("\n");
        const cleanHeading = heading.replace(/#/g, "").trim();

        addSectionHeading(cleanHeading.toUpperCase());

        content
          .filter((l) => l.trim())
          .forEach((line) => {
            const cleanLine = line
              .replace(/\*\*/g, "")
              .replace(/^-\s*/, "• ")
              .replace(/^###\s*/, "");

            if (cleanLine.startsWith("•")) {
              addText(cleanLine, 11, false, margin + 5);
            } else if (cleanLine.includes(":")) {
              const [label, value] = cleanLine.split(":");
              addText(`${label.trim()}:`, 11, true, margin);
              addText(value.trim(), 11, false, margin + 8);
            } else {
              addText(cleanLine, 11, false, margin);
            }
          });

        verticalPosition += 6; // Add space between sections
      });

      pdf.save("resume.pdf");
    } catch (error) {
      console.error("Download failed:", error);
      alert("Error generating PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="resume-editor-container">
      <div className="mode-toggle">
        <button
          onClick={() => setPreviewMode("edit")}
          className={previewMode === "edit" ? "active" : ""}
        >
          Edit Mode
        </button>
        <button
          onClick={() => setPreviewMode("preview")}
          className={previewMode === "preview" ? "active" : ""}
        >
          Preview Mode
        </button>
      </div>

      {previewMode === "preview" ? (
        <div className="markdown-preview" ref={previewRef}>
          <MDEditor.Markdown
            source={value}
            data-color-mode="light"
            style={{
              padding: "1rem",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
            }}
          />
        </div>
      ) : (
        <MDEditor
          value={value}
          onChange={(value) => setValue(value || "")}
          height={800}
          preview="edit"
          data-color-mode="light"
        />
      )}

      <div className="save-container w-full flex items-center justify-end">
        <div className="flex gap-3">
          <Button
            onClick={() => {
              console.log("clicking");
              handleDownload().catch((error) =>
                console.error("Download error:", error)
              );
            }}
            disabled={isDownloading}
            className="download-button bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer"
          >
            {isDownloading ? (
              <div className="flex gap-2 items-center">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="ml-2">Generating PDF...</span>
              </div>
            ) : (
              "Download PDF"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
