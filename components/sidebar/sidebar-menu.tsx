import React from "react";

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const SidebarMenu = ({ title, children }: Props) => {
  return (
    <div className="flex gap-2 flex-col border-gray-400 dark:border-gray-700 border-b pb-2">
      <span className="text-sm font-semibold text-gray-100 dark:text-gray-400">{title}</span>
      {children}
    </div>
  );
};
