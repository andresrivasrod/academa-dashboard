
import { Link, useLocation } from "react-router-dom";
import {
  BarChart,
  Calendar,
  Home,
  Settings,
  Users,
} from "lucide-react";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <SidebarComponent>
      <SidebarHeader className="flex items-center justify-between pb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className={isActive("/") ? "bg-gray-700 text-white" : "hover:bg-gray-700"}>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className={isActive("/admin/dashboard") ? "bg-gray-700 text-white" : "hover:bg-gray-700"}>
              <Link to="/admin/dashboard" className="flex items-center">
                <BarChart className="mr-2 h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className={isActive("/admin/users") ? "bg-gray-700 text-white" : "hover:bg-gray-700"}>
              <Link to="/admin/users" className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                <span>Users</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className={isActive("/admin/classes") ? "bg-gray-700 text-white" : "hover:bg-gray-700"}>
              <Link to="/admin/classes" className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                <span>Classes</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="pt-2">
        <SidebarMenu>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
