"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Avatar, Tooltip } from "@nextui-org/react";

import { Sidebar } from "./sidebar.styles";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { useSidebarContext } from "../layout/layout-context";

// Íconos
import { HomeIcon } from "../icons/sidebar/home-icon";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { ViewIcon } from "../icons/sidebar/view-icon";
import { CustomersIcon } from "../icons/sidebar/customers-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { FilterIcon } from "../icons/sidebar/filter-icon";

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, toggleSidebar } = useSidebarContext();
  const [hovered, setHovered] = useState(false);

  const isExpanded = !collapsed || hovered;

  return (
    <aside
      className="relative z-[20]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Overlay solo en mobile */}
      {collapsed && !hovered && (
        <div className={Sidebar.Overlay()} onClick={toggleSidebar} />
      )}

      <div className={Sidebar({ collapsed: !isExpanded })}>
        {/* HEADER */}
        <div className={Sidebar.Header()}>
          {isExpanded && <h1 className="text-lg font-bold px-4">Panel</h1>}
        </div>

        {/* BODY */}
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Inicio"
              icon={<HomeIcon />}
              isActive={pathname === "/"}
              href="/"
              showText={isExpanded}
            />

            <SidebarMenu title={isExpanded ? "Gestión de Archivos" : ""}>
              <SidebarItem
                title="Subir PDF"
                icon={<BalanceIcon />}
                isActive={pathname === "/dashboard/archivos/subir"}
                href="/dashboard/archivos/subir"
                showText={isExpanded}
              />
              <SidebarItem
                title="Listado de Archivos"
                icon={<ViewIcon />}
                isActive={pathname === "/dashboard/archivos"}
                href="/dashboard/archivos"
                showText={isExpanded}
              />
              
            </SidebarMenu>

            <SidebarMenu title={isExpanded ? "Usuarios" : ""}>
              <SidebarItem
                title="Usuarios"
                icon={<CustomersIcon />}
                isActive={pathname === "/dashboard/usuarios"}
                href="/dashboard/usuarios"
                showText={isExpanded}
              />
            </SidebarMenu>
          </div>

          {/* FOOTER */}

          <div className={Sidebar.Footer()}>
            <Tooltip content="Configuración" color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content="Preferencias" color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>
            <Tooltip content="Perfil" color="primary">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="sm"
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  );
};
