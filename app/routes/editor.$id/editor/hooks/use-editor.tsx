import { ScreenType } from "@/form/types";
import { createContext, useContext } from "react";

interface EditorContextProps {
  deleteScreen: (index: number) => void;
  setScreen: (index: number) => void;
  setEndScreen: () => void;
  screen: ScreenType;
  screenForm: string;
  screens: ScreenType[];
  endScreen: ScreenType;
}

export const EditorContext = createContext<EditorContextProps | null>(null);

export function useEditor(): EditorContextProps | never {
  const context = useContext(EditorContext);
  if (!context) throw new Error("");
  return context;
}
