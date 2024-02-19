import { CreditCard, LogOut, User } from "lucide-react";
import { Navbar, NavbarItem } from "@/components/interface/navbar";
import { Container } from "@/components/interface/container";
import { LogoFull } from "./logo";
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
    <Navbar>
      <Container className="flex justify-between max-w-7xl p-0">
        <NavbarItem>
          <LogoFull href="/" />
        </NavbarItem>
        <NavbarItem>
          <NavbarDashboardActionsDropdown />
        </NavbarItem>
      </Container>
    </Navbar>
  );
}

function NavbarDashboardActionsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <NavbarActionsAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background mr-4">
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CreditCard className="mr-2 h-4 w-4 text-success" />
          <span>Pagamento</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {}}>
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
