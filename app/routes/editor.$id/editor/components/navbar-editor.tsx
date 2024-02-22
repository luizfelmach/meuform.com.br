import { Loader, MoveLeft, Unlink2 } from "lucide-react";
import CopyToClipboard from "react-copy-to-clipboard";
import { toast } from "sonner";
import { useFormContext } from "react-hook-form";
import { Navbar, NavbarItem } from "@/components/interface/navbar";
import { Button } from "@/components/ui/button";
import { InputInline } from "@/components/interface/input-inline";
import { useNavigate } from "@remix-run/react";

export function NavbarEditor() {
  const navigate = useNavigate();
  const {
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useFormContext();

  return (
    <Navbar className="flex justify-between">
      <NavbarItem className="gap-4">
        <div>
          <Button
            type="button"
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            <MoveLeft />
          </Button>
        </div>
        <div className="hidden sm:flex">
          <span className="font-bold">form/</span>
          <InputInline
            className={`bg-accent rounded-lg px-1 min-w-10 max-w-sm truncate transition-colors ${
              errors["name"] && "bg-destructive/40"
            }`}
            preventEnter
            onInput={(e) => {
              setValue("name", e.currentTarget.innerText.trim());
            }}
            value={getValues("name")}
          />
        </div>
      </NavbarItem>
      <NavbarItem className="gap-4">
        <CopyToClipboard text={getValues("id")}>
          <Button
            type="button"
            className="h-9 bg-accent text-accent-foreground hover:bg-accent/50"
            size={"icon"}
            onClick={() => {
              toast.info("Link copiado para a área de transferência.");
            }}
          >
            <Unlink2 />
          </Button>
        </CopyToClipboard>
        <Button type="submit" className="h-9 font-bold" disabled={isSubmitting}>
          Publicar{" "}
          {isSubmitting && (
            <span>
              <Loader className="animate-spin" />
            </span>
          )}
        </Button>
      </NavbarItem>
    </Navbar>
  );
}
