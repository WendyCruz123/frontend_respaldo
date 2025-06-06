
"use client";

import React from "react";
import { useLockedBody } from "../hooks/useBodyLock";
import { NavbarWrapper } from "../navbar/navbar";
import { SidebarWrapper } from "../sidebar/sidebar";
import { SidebarContext } from "./layout-context";
import { BurguerButton } from "../navbar/burguer-button";

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [_, setLocked] = useLockedBody(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setLocked(!sidebarOpen);
  };

  return (
    <SidebarContext.Provider
      value={{
        collapsed: !sidebarOpen,      // ✅ este es tu booleano real
        toggleSidebar: handleToggleSidebar, // ✅ esta es tu función toggle
      }}
    >  
<section className="flex">
        <SidebarWrapper />
        <NavbarWrapper>
          {/* Botón hamburguesa */}
          <div className="p-4">
            <BurguerButton />
          </div>

          {/* Contenido */}
          {children}
        </NavbarWrapper>
      </section>
    </SidebarContext.Provider>
  );
};
