"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BrainCircuitIcon, FileUser } from "lucide-react";
import Link from "next/link";
import React from "react";

const items = [
  {
    title: "Career Guidance",
    url: "/career-guidance",
    icon: FileUser,
    auth: true,
  },
  {
    title: "Resume Enhancer",
    url: "/resume-enhancer",
    icon: BrainCircuitIcon,
  },
];

export const Mainsection = () => {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title} className="">
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={false}
                onClick={() => {}}
              >
                <Link href={item.url} className="flex items-center gap-4 ">
                  <item.icon />
                  <span className="text-sm">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
