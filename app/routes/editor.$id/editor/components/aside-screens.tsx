import { Button } from "@/components/ui/button";
import { Copy, Layers, MoreVertical, PlusCircle, Trash } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { DropResult } from "@hello-pangea/dnd";
import { ScrollArea } from "@/components/ui/scroll-area";
import { inputsTypes } from "../utils/config";
import { AsideEditor } from "./aside-editor";
import { ScreenCard } from "./screen-card";
import { createScreen, duplicateScreen } from "../utils/screen";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditor } from "../hooks/use-editor";
import { FormType } from "@/form/types";
import { Dnd } from "@/components/interface/dnd";

export function AsideScreens() {
  return (
    <Tabs defaultValue="screens" className="mt-4 mx-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="screens">Telas</TabsTrigger>
        <TabsTrigger value="design" disabled>
          Design
        </TabsTrigger>
      </TabsList>
      <TabsContent value="screens">
        <TabScreens />
      </TabsContent>
      <TabsContent value="design">Design</TabsContent>
    </Tabs>
  );
}

function TabScreens() {
  const { screens, endScreen, setScreen, screen, setEndScreen } = useEditor();
  const { control } = useFormContext<FormType>();
  const { swap } = useFieldArray({ control, name: "screens" });

  function handleDragEnd(result: DropResult) {
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }
    setScreen(result.destination.index);
    swap(result.destination.index, result.source.index);
  }
  return (
    <AsideEditor.Root>
      <AsideEditor.Section>
        <AsideEditor.Header>
          <AsideEditor.Title>Perguntas</AsideEditor.Title>
          <AppendOptions />
        </AsideEditor.Header>
        <Dnd.Root onDragEnd={handleDragEnd}>
          <Dnd.Droppable droppableId="pages" direction="vertical">
            <AsideEditor.Content>
              {screens.map((s, index) => (
                <Dnd.Draggable
                  draggableId={s.screenKey}
                  key={s.screenKey}
                  index={index}
                >
                  <ScreenCard.Root
                    active={s.screenKey === screen?.screenKey}
                    onClick={() => {
                      setScreen(index);
                    }}
                  >
                    <ScreenCard.Title>{s.title}</ScreenCard.Title>
                    <ScreenCard.Actions>
                      <ScreenOptions index={index} />
                    </ScreenCard.Actions>
                  </ScreenCard.Root>
                </Dnd.Draggable>
              ))}
            </AsideEditor.Content>
          </Dnd.Droppable>
        </Dnd.Root>
      </AsideEditor.Section>

      <AsideEditor.Section>
        <AsideEditor.Header>
          <AsideEditor.Title>Tela final</AsideEditor.Title>
        </AsideEditor.Header>
        <AsideEditor.Content>
          <ScreenCard.Root
            active={endScreen.screenKey === screen.screenKey}
            onClick={() => {
              setEndScreen();
            }}
          >
            <ScreenCard.Title>{endScreen.title}</ScreenCard.Title>
          </ScreenCard.Root>
        </AsideEditor.Content>
      </AsideEditor.Section>
    </AsideEditor.Root>
  );
}

function AppendOptions() {
  const { setScreen, screens } = useEditor();
  const { control } = useFormContext<FormType>();
  const { append } = useFieldArray({ control, name: "screens" });

  function handleClick(type: string) {
    const newScreen = createScreen(type);
    append(newScreen);
    setScreen(screens.length);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <PlusCircle />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4">
        {inputsTypes.map((inputType) => (
          <DropdownMenuItem
            key={inputType.value}
            onClick={() => {
              handleClick(inputType.value);
            }}
          >
            <span className="mr-2">
              <img
                src={inputType.img}
                width={25}
                height={10}
                alt={`Pergunto do tipo: ${inputType.value}`}
              />
            </span>
            {inputType.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ScreenOptions({ index }: { index: number }) {
  const { screens, deleteScreen, setScreen } = useEditor();
  const { control } = useFormContext<FormType>();
  const { append } = useFieldArray({ control, name: "screens" });
  const disabled = screens.length <= 1;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={(e) => {
            const screen = screens[index];
            const newScreen = duplicateScreen(screen);
            append(newScreen);
            setScreen(screens.length);
            e.stopPropagation();
          }}
        >
          <Copy className="mr-2 h-4 w-4" />
          Duplicar
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={disabled}
          onClick={(e) => {
            deleteScreen(index);
            e.stopPropagation();
          }}
        >
          <Trash className="mr-2 h-4 w-4 text-destructive" />
          Apagar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AsideScreensMobile() {
  return (
    <div className="xl:hidden">
      <Sheet>
        <SheetTrigger asChild className="mx-4 mt-4">
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/50"
            size={"icon"}
          >
            <Layers />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="w-full p-0">
          <ScrollArea className="h-5/6">
            <div className="w-full my-16">
              <AsideScreens />
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
