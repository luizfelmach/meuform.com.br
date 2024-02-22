import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings, Trash } from "lucide-react";
import { inputsTypes, queries } from "../utils/config";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { QueryBuilder } from "./query-builder";
import { AsideEditor } from "./aside-editor";
import { useEditor } from "../hooks/use-editor";
import { FormType } from "@/form/types";

export function AsideSettings() {
  const { screen } = useEditor();

  if (screen?.type === "end") return null;

  return (
    <Tabs defaultValue="settings" className="mt-4 mx-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="settings">Configurações</TabsTrigger>
        <TabsTrigger value="logic">Lógica</TabsTrigger>
      </TabsList>
      <TabsContent value="settings">
        <TabSettings />
      </TabsContent>
      <TabsContent value="logic" className="m-2">
        <TabLogic />
      </TabsContent>
    </Tabs>
  );
}

function TabSettings() {
  const { screen } = useEditor();
  const type = screen?.type;
  return (
    <AsideEditor.Root>
      <AsideEditor.Section>
        <AsideEditor.Header>
          <AsideEditor.Title>Tipo de pergunta</AsideEditor.Title>
        </AsideEditor.Header>
        <AsideEditor.Content>
          <SelectInputType />
        </AsideEditor.Content>
      </AsideEditor.Section>

      {type !== "statement" && (
        <AsideEditor.Section>
          <AsideEditor.Header>
            <AsideEditor.Title>Configurações adicionais</AsideEditor.Title>
          </AsideEditor.Header>
          <AsideEditor.Content>
            <SwitchSetting option="required" label="Obrigatório" />
            {type === "text" && (
              <>
                <SwitchSetting option="cpf" label="CPF" />
                <SwitchSetting option="email" label="E-mail" />
              </>
            )}
          </AsideEditor.Content>
        </AsideEditor.Section>
      )}
    </AsideEditor.Root>
  );
}

function TabLogic() {
  const { screen, screenForm, screens } = useEditor();
  const { control } = useFormContext<FormType>();

  const { append, remove } = useFieldArray({
    control,
    name: `${screenForm}.skip` as any,
  });

  return (
    <AsideEditor.Root>
      {screen.skip && screen.skip?.length > 0 && (
        <AsideEditor.Section>
          <AsideEditor.Header>
            <AsideEditor.Title>Lógicas aplicadas</AsideEditor.Title>
          </AsideEditor.Header>
          <AsideEditor.Content>
            {screen.skip.map((q, index) => (
              <div
                key={index}
                className="flex items-center justify-between mb-4"
              >
                <div>
                  <p className="font-bold">
                    Quando:{" "}
                    <span className="font-normal">
                      {screens.find((e) => e.screenKey === q.screenKey)?.title}
                    </span>
                  </p>
                  <p className="font-bold">
                    Condição:{" "}
                    <span className="font-normal">
                      {
                        queries[q.screenType].find((e) => e.value === q.query)
                          ?.label
                      }
                    </span>
                  </p>
                  <p className="font-bold">
                    Valor: <span className="font-normal">{q.value}</span>
                  </p>
                </div>
                <div>
                  <Button
                    type="button"
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <Trash className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </AsideEditor.Content>
        </AsideEditor.Section>
      )}
      <AsideEditor.Section>
        <QueryBuilder availableScreens={screens} onSave={(q) => append(q)} />
      </AsideEditor.Section>
    </AsideEditor.Root>
  );
}

function SelectInputType() {
  const { screenForm } = useEditor();
  const { control, watch } = useFormContext<FormType>();
  const setting = (screenForm + ".type") as any;
  const type = watch(setting);

  return (
    <FormField
      control={control}
      name={setting}
      render={({ field }) => (
        <FormItem>
          <Select onValueChange={field.onChange} value={type}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {inputsTypes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center">
                    <span className="mr-2">
                      <img
                        src={option.img}
                        width={25}
                        height={10}
                        alt={`Pergunto do tipo: ${option.value}`}
                      />
                    </span>
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}

interface SwitchSettingProps {
  option: string;
  label: string;
}

function SwitchSetting({ option, label }: SwitchSettingProps) {
  const { screenForm } = useEditor();
  const { control, watch } = useFormContext<FormType>();
  const setting = (screenForm + "." + option) as any;
  const required = watch(setting);

  return (
    <FormField
      control={control}
      name={setting}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-sm">{label}</FormLabel>
          </div>
          <FormControl>
            <Switch checked={required} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

export function AsideSettingsMobile() {
  const { screen } = useEditor();

  if (screen?.type === "end") return null;

  return (
    <div className="xl:hidden">
      <Sheet>
        <SheetTrigger asChild className="mx-4 mt-4">
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/50"
            size={"icon"}
          >
            <Settings />
          </Button>
        </SheetTrigger>
        <SheetContent side={"right"} className="w-full p-0">
          <ScrollArea className="h-5/6">
            <div className="w-full my-16">
              <AsideSettings />
            </div>
          </ScrollArea>
          <SheetFooter className="mt-8 mx-4">
            <SheetClose asChild>
              <Button type="submit">Concluir</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
