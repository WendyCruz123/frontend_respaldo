import { Navbar, NavbarContent, Button } from "@nextui-org/react";
import React from "react";
import { BurguerButton } from "./burguer-button";
import { UserDropdown } from "./user-dropdown";
import { DarkModeSwitch } from "./darkmodeswitch";
import { LogoutButton } from "./logout-button";

interface Props {
  children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
  return (
    <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <Navbar
        isBordered
        className="w-full bg-gradient-to-r bg-blue-500 text-white dark:bg-[#1e1e2f] dark:text-white shadow-md"
        classNames={{
          wrapper: "w-full max-w-full",
        }}
      >
        <NavbarContent>
          <BurguerButton />
        </NavbarContent>

        {/* Título central siempre visible y centrado */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 animate-fade-in">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 md:w-10 md:h-10 rounded-full shadow" />
          <span className="text-lg md:text-2xl font-semibold tracking-wide">Sistema de Archivos PDF</span>
        </div>

        <NavbarContent
          justify="end"
          className="w-fit data-[justify=end]:flex-grow-0 gap-4"
        >
          {/* Dark mode switch */}
          <NavbarContent>
            <DarkModeSwitch />
          </NavbarContent>

          {/* Log out button con nuevo diseño */}
          <NavbarContent>
            <LogoutButton />
          </NavbarContent>

          {/* User dropdown */}
          <NavbarContent>
            <UserDropdown />
          </NavbarContent>
        </NavbarContent>
      </Navbar>
      {children}

      <style jsx global>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};
