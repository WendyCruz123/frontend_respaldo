import { tv } from "@nextui-org/react";

export const SidebarWrapper = tv({
  base:[ "transition-all h-screen bg-background border-r border-divider z-[202] overflow-y-auto flex flex-col py-6 px-3",
  // // Color adaptable a modo claro/oscuro
  "bg-blue-900 text-white dark:bg-[#1e1e2f] dark:text-white"],
    variants: {
    collapsed: {
      true: "w-16",           // Solo íconos
      false: "w-64",          // Íconos + texto
    },
  },
});
export const Overlay = tv({
  base: "bg-[rgb(15_23_42/0.3)] fixed inset-0 z-[201] opacity-80 transition-opacity md:hidden md:z-auto md:opacity-100",
});

export const Header = tv({
  base: "flex gap-8 items-center px-6",
});

export const Body = tv({
  base: "flex flex-col gap-6 mt-9 px-2",
});

export const Footer = tv({
  base: "flex items-center justify-center gap-6 pt-16 pb-8 px-8 md:pt-10 md:pb-0",
});

export const Sidebar = Object.assign(SidebarWrapper, {
  Header,
  Body,
  Overlay,
  Footer,
});
