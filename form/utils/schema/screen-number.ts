import * as yup from "yup";
import { ScreenEntity } from ".";
import { ScreenType, ScreenTypes, SkipQuery } from "../../types";

export class ScreenNumber implements ScreenEntity {
  type: ScreenTypes;
  screenKey: string;
  title: string;
  description: string;
  options: string[];
  required: boolean;
  cpf: boolean;
  email: boolean;
  skip: SkipQuery[];

  constructor(screen: ScreenType) {
    this.type = screen.type;
    this.screenKey = screen.screenKey;
    this.title = screen.title;
    this.description = screen.description;
    this.options = screen.options;
    this.required = screen.required;
    this.cpf = screen.cpf;
    this.email = screen.email;
    this.skip = screen.skip;
  }

  getSchema() {
    let schema = yup
      .number()
      .transform((val, orig) => (orig == "" ? undefined : val))
      .typeError("Campo deve ser um número.");

    this.required && (schema = schema.required("Campo obrigatório."));

    return schema;
  }
}
