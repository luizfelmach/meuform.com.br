import { useNavigate } from "@remix-run/react";
import { CreditCard, LogOut, User } from "lucide-react";
import { Navbar, NavbarItem } from "@/components/interface/navbar";
import { Logo } from "@/components/interface/logo";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavbarDashboard() {
  return (
    <Navbar className="flex justify-between shadow-none">
      <NavbarItem className="gap-2">
        <Logo size={35} href="/dashboard" />
        <p className="font-black text-sm line-clamp-1">
          {"Luiz Felipe Machado"}
        </p>
      </NavbarItem>
      <NavbarItem>
        <NavbarDashboardActionsDropdown />
      </NavbarItem>
    </Navbar>
  );
}

function NavbarDashboardActionsDropdown() {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <NavbarActionsAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background mr-4 w-52 h-30">
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/billing")}>
          <CreditCard className="mr-2 h-4 w-4 text-success" />
          <span>Pagamento</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/signout")}>
          <LogOut className="mr-2 h-4 w-4 text-destructive" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavbarActionsAvatar() {
  return (
    <div className="h-9 w-9 bg-accent flex items-center justify-center rounded-full">
      <User className="h-5 w-5" />
    </div>
  );
}
