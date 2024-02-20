import * as yup from "yup";
import { AnswersType, ScreenType } from "../types";
import { parserScreenEntity } from "../utils/schema/parser";
import { queryValidateAnd } from "../utils/query";

export function getSchemaReply(screen: ScreenType): yup.AnySchema {
  const s = parserScreenEntity(screen);
  return s.getSchema();
}

export function getSchemasReply(screens: ScreenType[]) {
  const schemas = screens.map((screen) => [
    screen.screenKey,
    parserScreenEntity(screen).getSchema(),
  ]);
  const schema = Object.fromEntries(schemas);
  return yup.object(schema);
}

export function visibleScreenReply(screen: ScreenType, answers: AnswersType) {
  return queryValidateAnd(screen.skip, answers);
}
