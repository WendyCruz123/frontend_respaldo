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
        <div className="flex h-screen w-screen overflow-hidden relative">

          {/* Video background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
          >
            <source src="/login-bg.mp4" type="video/mp4" />
          </video>

          {/* Content overlay */}
          <div className="relative z-10 flex flex-1">
            <SidebarWrapper />
            <main className="flex-1 min-h-screen p-4 bg-white/50 backdrop-blur-sm">
              {children}
            </main>
          </div>
          
        </div>
      </SidebarContext.Provider>
    </Providers>
  );
}
