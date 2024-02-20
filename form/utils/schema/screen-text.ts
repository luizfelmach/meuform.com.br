import * as yup from "yup";
import { ScreenEntity } from ".";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { ScreenType, ScreenTypes, SkipQuery } from "../../types";

export class ScreenText implements ScreenEntity {
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
    let schema = yup.string();
    this.required && (schema = schema.required("Campo obrigatório."));
    this.email && (schema = schema.email("Informe um e-mail válido."));
    this.cpf &&
      (schema = schema.test(
        "cpf-validate",
        "Forneça um CPF válido.",
        (value) => {
          if (value) {
            return cpfValidator.isValid(value);
          }
          return true;
        }
      ));

    return schema;
  }
}
