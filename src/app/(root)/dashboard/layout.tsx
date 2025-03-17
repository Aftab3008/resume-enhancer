import { HomeSideBar } from "@/components/home-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen ">
        <HomeSideBar />
        <div className="flex-1 overflow-hidden">
          <SidebarTrigger className="cursor-pointer" />
          <div className="p-4">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
