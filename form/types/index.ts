export type ScreenTypes =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "checkbox"
  | "radio"
  | "statement"
  | "end";

export type QueryTypes =
  | "equals"
  | "notEquals"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "lt"
  | "gt"
  | "lte"
  | "gte"
  | "has";

export type SkipQuery = {
  screenKey: string;
  screenType: ScreenTypes;
  query: QueryTypes;
  value: any;
};

export type ScreenType = {
  screenKey: string;
  type: ScreenTypes;
  title: string;
  description: string;
  options: string[];
  required: boolean;
  cpf: boolean;
  email: boolean;
  skip: SkipQuery[];
};

export type FormType = {
  id: string;
  name: string;
  screens: ScreenType[];
  endScreen: ScreenType;
};

export type AnswersType = Record<string, any>;
