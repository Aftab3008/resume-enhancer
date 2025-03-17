import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/components/Header";
import { Toaster } from "sonner";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Resume Enhancer",
  description: "A tool to help you write better resumes",
  icons: ["/logosaas.png"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={twMerge(dmSans.className, "antialiased bg-[#EAEEFE]")}>
          <Toaster richColors={true} />
          <Header />
          {children}
        </body>
      </ClerkProvider>
    </html>
  );
}
