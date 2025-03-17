"use client";
import avatar1 from "../../public/avatar-1.png";
import avatar2 from "../../public/avatar-2.png";
import avatar3 from "../../public/avatar-3.png";
import avatar4 from "../../public/avatar-4.png";
import avatar5 from "../../public/avatar-5.png";
import avatar6 from "../../public/avatar-6.png";
import avatar7 from "../../public/avatar-7.png";
import avatar8 from "../../public/avatar-8.png";
import avatar9 from "../../public/avatar-9.png";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    text: "The AI career recommendations helped me identify perfect roles I never would have considered on my own. Landed a Data Analyst position within 2 months!",
    imageSrc: avatar1.src,
    name: "Priya Patel",
    username: "@data_enthusiast",
  },
  {
    text: "The resume optimizer transformed my generic CV into a job-specific masterpiece. Got 3x more interview calls after using it!",
    imageSrc: avatar2.src,
    name: "Marcus Chen",
    username: "@cs_student",
  },
  {
    text: "Never knew my linguistics background could transition into AI engineering. The personalized skill gap analysis was eye-opening!",
    imageSrc: avatar3.src,
    name: "Aisha Mohammed",
    username: "@linguistics2tech",
  },
  {
    text: "Generated 5 tailored resumes for different roles in minutes. The keyword optimization helped me pass automated screeners effortlessly.",
    imageSrc: avatar4.src,
    name: "Ethan Johnson",
    username: "@jobhuntpro",
  },
  {
    text: "The industry trend matching helped me pivot from traditional marketing to AI-driven digital strategies. Career game-changer!",
    imageSrc: avatar5.src,
    name: "Sophia Rodriguez",
    username: "@marketingmaven",
  },
  {
    text: "As a career switcher, the course recommendations helped me build exactly the skills employers wanted. No more guessing!",
    imageSrc: avatar6.src,
    name: "Omar Wilson",
    username: "@careerpivot",
  },
  {
    text: "The resume formatting suggestions made my experience stand out clearly. Recruiters actually comment on how readable my CV is now.",
    imageSrc: avatar7.src,
    name: "Lila Nguyen",
    username: "@designresumes",
  },
  {
    text: "Discovered emerging roles in AI ethics I didn't know existed. The career path suggestions matched perfectly with my philosophy background.",
    imageSrc: avatar8.src,
    name: "Raj Kapoor",
    username: "@tech_ethicist",
  },
  {
    text: "From generic resume to targeted applications - the AI suggestions helped me highlight exactly what different companies wanted to see.",
    imageSrc: avatar9.src,
    name: "Gabriela Silva",
    username: "@gradstudent",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, imageSrc, name, username }) => (
                <div className="card" key={username}>
                  <div>{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <Image
                      width={40}
                      height={40}
                      src={imageSrc}
                      alt={name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5">
                        {name}
                      </div>
                      <div className="leading-5 tracking-tight">{username}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

export const Testimonials = () => {
  return (
    <section className="bg-white sm:pt-14">
      <div className="container">
        <div className="section-heading">
          <div className="flex justify-center">
            <div className="tag">Testimonials</div>
          </div>

          <h2 className="section-title mt-5">What our users say</h2>
          <p className="section-des mt-5">
            From intuitive design to powerful features, out app has become an
            essential tool for users around the world.
          </p>
        </div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};
