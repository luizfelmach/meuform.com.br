import { Separator } from "@/components/ui/separator";
import { HeaderDashboard } from "../dashboard/header";

export default function Page() {
  return (
    <div>
      <HeaderDashboard.Root className="max-w-5xl mx-auto px-4">
        <HeaderDashboard.Content>
          <HeaderDashboard.Title>Perfil</HeaderDashboard.Title>
          <HeaderDashboard.Description>
            Gerencie sua conta.
          </HeaderDashboard.Description>
        </HeaderDashboard.Content>
      </HeaderDashboard.Root>

      <Separator className="mb-10" />
    </div>
  );
}
