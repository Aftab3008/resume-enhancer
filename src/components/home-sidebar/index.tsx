import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { Mainsection } from "./main-section";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logosaas.png";
import { UserButton } from "@clerk/nextjs";

export const HomeSideBar = () => {
  return (
    <Sidebar
      className=" z-40  border-r-2 pt-18"
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader className="bg-[#EAEEFE]">
        <Link href={"/"} className="flex space-x-3">
          <Image src={Logo} alt="Saas logo" height={40} width={40} />
        </Link>
      </SidebarHeader>
      <SidebarContent className="bg-[#EAEEFE]">
        {" "}
        <Mainsection />
        <Separator />
      </SidebarContent>
      <SidebarFooter className="bg-[#EAEEFE]">
        <div>
          <UserButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
