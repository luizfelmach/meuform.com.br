import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScreenType, SkipQuery } from "@/form/types";
import { useState } from "react";

interface QueryBuilderProps {
  availableScreens: ScreenType[];
  onSave: (q: SkipQuery) => void;
}

const queries: Record<string, Array<{ label: string; value: string }>> = {
  text: [
    {
      label: "Igual a",
      value: "equals",
    },
    {
      label: "Diferente de",
      value: "notEquals",
    },
    {
      label: "Tem a palavra",
      value: "contains",
    },
    {
      label: "Inicia com a palavra",
      value: "startsWith",
    },
    {
      label: "Termina com a palavra",
      value: "endsWith",
    },
  ],
  textarea: [
    {
      label: "Igual a",
      value: "equals",
    },
    {
      label: "Diferente de",
      value: "notEquals",
    },
    {
      label: "Tem a palavra",
      value: "contains",
    },
    {
      label: "Inicia com a palavra",
      value: "startsWith",
    },
    {
      label: "Termina com a palavra",
      value: "endsWith",
    },
  ],
  number: [
    {
      label: "Igual a",
      value: "equals",
    },
    {
      label: "Diferente de",
      value: "notEquals",
    },
    {
      label: "Maior que",
      value: "gt",
    },
    {
      label: "Menor que",
      value: "lt",
    },
    {
      label: "Maior que ou igual a",
      value: "gte",
    },
    {
      label: "Menor que ou igual a",
      value: "lte",
    },
  ],
  radio: [
    {
      label: "Igual a",
      value: "equals",
    },
    {
      label: "Diferente de",
      value: "notEquals",
    },
    {
      label: "Tem a palavra",
      value: "contains",
    },
    {
      label: "Inicia com a palavra",
      value: "startsWith",
    },
    {
      label: "Termina com a palavra",
      value: "endsWith",
    },
  ],
  date: [
    {
      label: "Igual a",
      value: "equals",
    },
    {
      label: "Diferente de",
      value: "notEquals",
    },
    {
      label: "Maior que",
      value: "gt",
    },
    {
      label: "Menor que",
      value: "lt",
    },
    {
      label: "Maior que ou igual a",
      value: "gte",
    },
    {
      label: "Menor que ou igual a",
      value: "lte",
    },
  ],
} as const;

const initialState = {
  screenType: "",
  screenKey: "",
  query: "",
  value: "",
};

export function QueryBuilder(props: QueryBuilderProps) {
  const { availableScreens, onSave } = props;
  const [modal, setModal] = useState<boolean>(false);
  const [result, setResult] = useState<SkipQuery>(initialState as SkipQuery);

  if (!modal) {
    return (
      <Button
        className="w-full bg-accent border-2 text-accent-foreground hover:bg-accent/50 h-11"
        onClick={() => setModal(true)}
      >
        Adicionar lógica
      </Button>
    );
  }

  const screens = availableScreens.filter(
    (screen) => screen.type !== "checkbox"
  );

  return (
    <div className="rounded-xl h-30 ">
      <p>Mostrar página atual quando</p>
      <section className="flex items-center justify-evenly mb-2 gap-2 border-2 bg-background rounded-lg">
        <div className="w-1/3">
          <Select
            onValueChange={(screenKey) => {
              const screen = screens.find((e) => e.screenKey === screenKey);
              setResult((prev) => {
                return {
                  ...prev,
                  screenKey,
                  screenType: screen!.type,
                };
              });
            }}
          >
            <SelectTrigger className="h-9 bg-transparent border-none outline-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {screens.map((screen, index) => (
                <SelectItem value={screen.screenKey} key={index}>
                  {screen.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-1/3">
          <Select
            disabled={(result.screenType as any) === ""}
            onValueChange={(screenQuery) => {
              setResult((prev) => {
                return {
                  ...prev,
                  query: screenQuery as any,
                };
              });
            }}
          >
            <SelectTrigger className="h-9 bg-transparent border-none outline-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {queries[result.screenType] &&
                queries[result.screenType].map((q, index) => (
                  <SelectItem key={index} value={q.value}>
                    {q.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className="">
          <Input
            className="h-9 bg-transparent border-none outline-none"
            onChange={(e) => {
              setResult((prev) => {
                return {
                  ...prev,
                  value: e.target.value,
                };
              });
            }}
          />
        </div>
      </section>
      <div className="flex justify-center w-full gap-2">
        <Button
          type="button"
          variant={"outline"}
          className="h-9 w-full"
          onClick={() => setModal(false)}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          className="h-9 w-full"
          onClick={() => {
            onSave(result);
            setModal(false);
          }}
        >
          Adicionar
        </Button>
      </div>
    </div>
  );
}
