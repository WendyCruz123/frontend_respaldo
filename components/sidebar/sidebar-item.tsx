import NextLink from "next/link";
import React from "react";
import { useSidebarContext } from "../layout/layout-context";
import clsx from "clsx";

interface Props {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  href?: string;
  showText?: boolean;
}

export const SidebarItem = ({
  icon,
  title,
  isActive,
  href = "",
  showText = true,
}: Props) => {
  const { toggleSidebar } = useSidebarContext();

  const handleClick = () => {
    // Cierra automáticamente el menú en pantallas pequeñas
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <NextLink
      href={href}
      className="text-default-900 active:bg-none max-w-full"
    >
      <div
  className={clsx(
    isActive
      ? "bg-slate-900 [&_svg_path]:fill-primary-200"
      : "hover:bg-slate-800",
    "flex gap-2 w-full min-h-[44px] h-full items-center px-3.5 rounded-xl cursor-pointer transition-all duration-150 active:scale-[0.98]"
  )}
  onClick={handleClick}
>
  <div className="w-6 h-6 flex items-center justify-center">
    {icon}
  </div>
  {showText && <span className="text-cyan-50 whitespace-nowrap">{title}</span>}
</div>

    </NextLink>
  );
};
