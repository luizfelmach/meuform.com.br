import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useLocation, useNavigate } from "@remix-run/react";

const menus = [
  { path: "/dashboard", label: "Formulários" },
  { path: "/dashboard/new", label: "Criar formulário" },
  { path: "/dashboard/payment", label: "Pagamento" },
  { path: "/dashboard/profile", label: "Minha conta" },
];

export function NavbarMenusDashboard() {
  const location = useLocation();

  return (
    <div className="sticky top-0 bg-background">
      <nav className="max-w-5xl mx-auto px-4">
        <ScrollArea className="max-w-full whitespace-nowrap">
          <div className="flex items-center w-max h-12 ">
            {menus.map(({ path, label }) => (
              <NavItem
                key={path}
                label={label}
                path={path}
                currentPath={location.pathname}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </nav>
      <div className="w-full border-b -translate-y-[5px]" />
    </div>
  );
}

interface NavItemProps {
  label: string;
  path: string;
  currentPath: string;
}

function NavItem({ label, path, currentPath }: NavItemProps) {
  const navigate = useNavigate();
  const active = path === currentPath || currentPath === path + "/";
  return (
    <div className="z-40">
      <p
        data-active={active}
        className="font-normal text-[0.9rem] text-foreground/80 hover:bg-foreground/5 rounded-lg p-2 transition-all cursor-pointer data-[active=true]:font-semibold"
        onClick={() => navigate(path)}
      >
        {label}
      </p>
      {active && (
        <div className="border-b-4 border border-primary rounded-full"></div>
      )}
    </div>
  );
}
