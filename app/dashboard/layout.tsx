"use client";
import React, { useState } from "react";
import { SidebarWrapper } from "@/components/sidebar/sidebar";
import { Providers } from "../providers";
import { SidebarContext } from "@/components/layout/layout-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  return (
    <Providers>
      <SidebarContext.Provider value={{ collapsed, toggleSidebar }}>
        <div className="flex">
          <SidebarWrapper />
          <main className="flex-1 min-h-screen p-4">{children}</main>
        </div>
      </SidebarContext.Provider>
    </Providers>
  );
}
