import { getQueryFn } from "./query";
import { AnswersType, SkipQuery } from "../../types";

export function queryValidate(q: SkipQuery, answers: AnswersType) {
  const { screenKey, screenType, query, value } = q;
  const result = getQueryFn(screenType, query);
  if (!result) return true;
  return result.fn(value, answers[screenKey]);
}

export function queryValidateAnd(q: SkipQuery[], answers: AnswersType) {
  const result = q
    .map((e) => queryValidate(e, answers))
    .reduce((p, c) => p && c, true);
  return result;
}
