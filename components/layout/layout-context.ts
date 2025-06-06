"use client";

import { createContext, useContext } from "react";

interface SidebarContextType {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextType>({
  collapsed: true,
  toggleSidebar: () => {},
});

export const useSidebarContext = () => useContext(SidebarContext);

