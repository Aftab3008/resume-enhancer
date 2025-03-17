import React from "react";
import Image from "next/image";
import res1 from "../../../../public/res1.jpg";
import res2 from "../../../../public/res2.jpg";
import res3 from "../../../../public/res3.jpg";
import { currentUser } from "@clerk/nextjs/server";

const Page = async () => {
  const resumes = [
    {
      title: "Full Stack Resume Template",
      file: "https://online.flippingbook.com/view/292712646/",
      image: res1,
    },
    {
      title: "SDE Resume Template",
      file: "https://online.flippingbook.com/view/292661296/",
      image: res2,
    },
    {
      title: "Data Analyst Resume Template",
      file: "https://online.flippingbook.com/view/292601962/",
      image: res3,
    },
  ];

  const user = await currentUser();
  if (!user) {
    return <div className="login-message">Login to view resumes</div>;
  }

  const userName = user.fullName;
  // console.log(userName);

  return (
    <div className="page-container">
      <h1 className="title">Dashboard</h1>

      <h2 className="greeting">
        Hello, <span className="user-name">{userName}</span>
      </h2>

      <div className="resumes-section">
        <h2 className="section-title">Tailored Resumes</h2>
        <div className="resumes-container">
          {resumes.map((resume, index) => (
            <div key={index} className="resume-card cursor-pointer">
              <h3 className="resume-title">{resume.title}</h3>
              <Image
                src={resume.image}
                alt={resume.title}
                className="resume-image"
                layout="responsive"
              />
              <a
                href={resume.file}
                className="resume-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
