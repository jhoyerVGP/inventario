"use client";

import * as React from "react";
import {
  AudioWaveform,
  Frame,
  History,
  IdCardLanyard,
  List,
  Package,
  ShoppingCart,
  Store,
  Truck,
  Inbox,
} from "lucide-react";

//import { NavDropDown } from "@/components/nav-main";
//import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
//import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
//importar el contexto de auth para obtener el user
import { useAuth } from "@/context/AuthContext";

import SidebarBanner from "./layout/HeaderSidebar";
import { NavButton } from "./nav-button";
import { BranchSelected } from "./BranchSelected";

// This is sample data.
const data = {
  user: {
    userId: "guest-id", // <--- Agrega esto
    name: "Sample Name",
    email: "m@example.com",
    role: "SELLER", // <--- Agrega esto también para cumplir con 'Role'
    avatar:
      "https://i.pinimg.com/736x/1a/1c/51/1a1c51325cf801bc1362bf363e3b584f.jpg",
  },
  navMain: [
    {
      title: "Empleados",
      url: "#",
      icon: IdCardLanyard,
      items: [
        {
          title: "Usuarios",
          url: "/dashboard/users",
        },
        {
          title: "Personal",
          url: "/dashboard/employees",
        },
      ],
    },
  ],
  buttons: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: Frame,
      permissions: "VIEW_DASHBOARD",
    },
    {
      name: "Sucursales",
      url: "/dashboard/branches",
      icon: Store,
      permissions: "VIEW_BRANCHES",
    },
    {
      name: "Productos",
      url: "/dashboard/products",
      icon: Package,
      permissions: "VIEW_PRODUCTS",
    },
    {
      name: "Categorias",
      url: "/dashboard/categories",
      icon: List,
      permissions: "VIEW_CATEGORIES",
    },
    {
      name: "Ventas",
      url: "/dashboard/sales",
      icon: History,
      permissions: "VIEW_SALES",
    },
    {
      name: "Movimientos",
      url: "/dashboard/movements",
      icon: AudioWaveform,
      permissions: "VIEW_MOVEMENTS",
    },
    {
      name: "Punto de Venta",
      url: "/dashboard/pos",
      icon: ShoppingCart,
      permissions: "VIEW_POS",
    },
    {
      name: "Empleados",
      url: "/dashboard/employees",
      icon: IdCardLanyard,
      permissions: "VIEW_EMPLOYEES",
    },
    {
      name: "Proveedores",
      url: "/dashboard/suppliers",
      icon: Truck,
      permissions: "VIEW_SUPPLIERS",
    },
    {
      name: "Compras",
      url: "/dashboard/compras",
      icon: Inbox,
      permissions: "VIEW_PURCHASES",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  //user desde el context
  let usera = useAuth().user ?? data.user;
  const role = usera?.role || "SINROLE";
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* Banner en el sidebar */}
        <SidebarBanner />
        {/* Selector de sucursales */}
        {role === "SUPERADMIN" && <BranchSelected />}
      </SidebarHeader>
      <SidebarContent>
        {/* Botones normales */}
        <NavButton projects={data.buttons} />
        {/* Menu con dropdowns */}
        {/* <NavDropDown items={data.navMain} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={usera ?? data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
