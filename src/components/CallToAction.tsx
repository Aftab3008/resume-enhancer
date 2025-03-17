"use client";

import starImage from "../../public/star.png";
import springImage from "../../public/spring.png";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {ArrowRightIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export const CallToAction = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const { isSignedIn } = useAuth();
  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-b from-white to-[#D2DCFF] py-24 overflow-x-clip"
    >
      <div className="container">
        <div className="section-heading relative">
          <h2 className="section-title"> Launch Your Career Journey Today</h2>
          <p className="section-des mt-5">
            Get AI-powered career pathfinding and resume optimization that helps
            you stand out in today&apos;s competitive job market.
          </p>

          <motion.img
            src={starImage.src}
            alt="star image"
            width={360}
            className="absolute -left-[350px] -top-[137px]"
            style={{
              translateY,
            }}
          />
          <motion.img
            src={springImage.src}
            alt="spring image"
            width={360}
            className="absolute -right-[331px] -top-[19px]"
            style={{
              translateY,
            }}
          />
        </div>

        <div className="flex gap-2 mt-10 justify-center">
          <Button asChild variant={"link"} className=" cursor-pointer ">
            <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>
              <span className="font-bold">Get Started</span>
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild variant={"link"} className=" cursor-pointer">
            <Link href={isSignedIn ? "/dashboard" : "/sign-in"}>
              <span className="text-sm">Enhance your resume</span>
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
