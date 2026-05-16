import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { HeaderMain } from "@/components/layout/HeaderMain";

const Layout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />

      {/* SidebarInset con flex y altura completa */}
      <SidebarInset className="flex flex-col overflow-hidden min-h-screen">
        {/* HEADER - Fijo */}
        <HeaderMain />

        {/* CONTENIDO - Sin overflow-auto, solo flex-1 */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
