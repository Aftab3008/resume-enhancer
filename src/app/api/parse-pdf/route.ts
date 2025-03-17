import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const pdfParser = new PDFParser(null, true);
    let parsedText = "";

    const parsePromise = new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (err) => reject(err));
      pdfParser.on("pdfParser_dataReady", () => {
        // Preserve bullet point formatting
        parsedText = (pdfParser as any)
          .getRawTextContent()
          .replace(/(•|∙|⦿)/g, "\n• ") // Standardize bullet characters
          .replace(/(\S)\n(\S)/g, "$1 $2") // Join broken lines
          .replace(/\n+/g, "\n"); // Remove empty lines

        resolve(parsedText);
      });
    });

    pdfParser.parseBuffer(buffer);

    await parsePromise;

    return NextResponse.json({
      text: parsedText,
      metadata: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      },
    });
  } catch (error) {
    console.error("PDF parsing error:", error);
    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}
