"use client";

import cogImage from "../../public/cog.png";
import cylinderImage from "../../public/cylinder.png";
import noodleImage from "../../public/noodle.png";
import { motion, useScroll, useTransform } from "framer-motion";

import { useRef } from "react";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export const Hero = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const { isSignedIn } = useAuth();
  return (
    <section
      ref={heroRef}
      className="pt-2 pb-20 md:pt-5 md:pb-10 overflow-x-clip w-full"
      style={{
        background:
          "radial-gradient(ellipse 200% 100% at bottom right, #183EC2, #EAEEFE 100%)",
      }}
    >
      <div className="container">
        <div className="md:flex items-center">
          <div className="md:w-[478px]">
            <div className="text-sm inline-flex border border-[#222]/10 px-3 py-1 rounded-lg tracking-tight">
              AI-Powered Career Suite
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-6">
              Smart Career Paths, Smarter Resumes
            </h1>
            <p className="text-xl text-zinc-950 tracking-tight mt-6">
              Transform your career journey with AI-driven insights. Get
              personalized career recommendations and optimize your resume to
              match employer expectations. Never miss an opportunity again.
            </p>
            <div className="flex gap-1 items-center mt-[30px]">
              {/* add button herre */}
              <Button
                variant="ghost"
                className="text-zinc-800 hover:bg-white/20 border border-[#001E80]/30 cursor-pointer"
                asChild
              >
                <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>
                  <span className="font-bold">Get Started</span>
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="mt-20 md:mt-0 md:h-[648px] md:flex-1 relative  md:ml-10">
            <motion.img
              src={cogImage.src}
              alt="Cog"
              className="md:absolute md:h-full md:w-auto md:max-w-none md:-left-6 lg:left-0"
              animate={{
                translateY: [-30, 30],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 3,
                ease: "easeInOut",
              }}
            />
            <motion.img
              src={cylinderImage.src}
              width={220}
              height={220}
              alt="Cylinder image"
              className="hidden md:block -top-8 -left-32 md:absolute"
              style={{
                translateY: translateY,
              }}
            />
            <motion.img
              src={noodleImage.src}
              width={220}
              alt="Noodle image"
              className="hidden lg:block top-[524px] left-[448px] absolute "
              style={{
                rotate: 30,
                translateY: translateY,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
