import { ScreenType } from "../../types";
import {
  ScreenCheckbox,
  ScreenDate,
  ScreenEnd,
  ScreenEntity,
  ScreenNumber,
  ScreenRadio,
  ScreenStatement,
  ScreenText,
  ScreenTextArea,
} from ".";

export function parserScreenEntity(screen: ScreenType): ScreenEntity | never {
  const { type } = screen;
  if (type === "text") return new ScreenText(screen);
  if (type === "textarea") return new ScreenTextArea(screen);
  if (type === "number") return new ScreenNumber(screen);
  if (type === "date") return new ScreenDate(screen);
  if (type === "radio") return new ScreenRadio(screen);
  if (type === "checkbox") return new ScreenCheckbox(screen);
  if (type === "end") return new ScreenEnd(screen);
  if (type === "statement") return new ScreenStatement(screen);
  throw new Error("unknown type");
}
