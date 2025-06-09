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
        <div className="relative w-full min-h-screen overflow-x-hidden">

          {/* Video background que cubre todo el contenido, no solo el viewport */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="fixed top-0 left-0 w-full h-full object-cover z-0"
          >
            <source src="/login-bg.mp4" type="video/mp4" />
          </video>

          {/* Contenido superpuesto */}
          <div className="relative z-10 flex min-h-screen">
            <SidebarWrapper />
            <main className="flex-1 p-4 bg-white/50 backdrop-blur-sm">
              {children}
            </main>
          </div>
          
        </div>
      </SidebarContext.Provider>
    </Providers>
  );
}
