import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useEditor } from "../hooks/use-editor";
import { FormType } from "@/form/types";

export function ModalAddOptions() {
  const { screen, screenForm } = useEditor();
  const { setValue } = useFormContext<FormType>();

  const [options, setOptions] = useState<string[]>(screen?.options ?? []);
  const [modal, setModal] = useState<boolean>(false);

  return (
    <Drawer open={modal} onOpenChange={(o) => setModal(o)}>
      <DrawerTrigger asChild>
        <Button className="mt-6" type="button" variant="ghost">
          Editar opções
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-xl">
          <DrawerHeader>
            <DrawerTitle>Edite as opções</DrawerTitle>
            <DrawerDescription>
              Coloque cada opção em uma linha.
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4">
            <Textarea
              onChange={(e) => {
                setOptions(e.target.value.split("\n"));
              }}
              value={options.join("\n")}
              rows={10}
            />
          </div>

          <DrawerFooter>
            <Button
              onClick={() => {
                let withoutEmptyStrings = options.filter(
                  (option) => option !== ""
                );
                let withoutDuplicated = Array.from(
                  new Set(withoutEmptyStrings)
                );
                setValue(`${screenForm}.options` as any, withoutDuplicated);
                setModal(false);
              }}
            >
              Atualizar
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
