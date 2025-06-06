"use client";
import { Menu } from "lucide-react";
import { useSidebarContext } from "../layout/layout-context";

export const BurguerButton = () => {
  const { toggleSidebar } = useSidebarContext();

  return (
    <button
      onClick={toggleSidebar}
      className="text-white p-2 hover:bg-gray-700 rounded-md absolute top-4 left-4 z-50"
    >
      <Menu className="w-6 h-6" />
    </button>
  );
};
