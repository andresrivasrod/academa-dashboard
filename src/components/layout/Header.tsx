import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Iniciales para el avatar
  const initials = user
    ? `${user.name?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "??";

  return (
    <header className="h-16 px-4 md:px-6 flex items-center border-b border-gray-700">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
        </div>

        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 text-white">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={user?.name || "Usuario"} />
                  <AvatarFallback className="bg-purple-500">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline-block">
                  {user ? `${user.name} ${user.lastName}` : "Invitado"}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 bg-gray-800 text-white border border-gray-700"
            >
              {/* Header con datos del usuario */}
              <div className="px-4 py-2 border-b border-gray-700">
                <p className="font-medium">
                  {user ? `${user.name} ${user.lastName}` : "Invitado"}
                </p>
                <p className="text-sm text-gray-400">{user?.email || "Sin correo"}</p>
                <p className="text-xs text-purple-400 mt-1">
                  Rol: {user?.role || "N/A"}
                </p>
              </div>

              <DropdownMenuSeparator className="bg-gray-700" />

              <DropdownMenuItem
                onClick={handleLogout}
                className="hover:bg-gray-700 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
