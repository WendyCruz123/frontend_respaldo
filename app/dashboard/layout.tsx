"use client"; 

import React, { useState } from "react";
import { SidebarWrapper } from "@/components/sidebar/sidebar";
import { Providers } from "../providers";
import { SidebarContext } from "@/components/layout/layout-context";
import { NavbarWrapper } from "@/components/navbar/navbar";

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

          {/* Contenido superpuesto con Navbar */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <NavbarWrapper>
              <div className="flex flex-1">
                <SidebarWrapper />
                <main className="flex-1 p-4 bg-white/30 dark:bg-black/40 backdrop-blur-sm">
                  {children}
                </main>
              </div>
            </NavbarWrapper>
          </div>
        </div>
      </SidebarContext.Provider>
    </Providers>
  );
}
