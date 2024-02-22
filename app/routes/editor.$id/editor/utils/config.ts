export const inputsTypes = [
  {
    value: "text",
    label: "Texto",
    img: "/input-type/text.svg",
  },
  {
    value: "textarea",
    label: "Bloco de texto",
    img: "/input-type/textarea.svg",
  },
  {
    value: "number",
    label: "Número",
    img: "/input-type/number.svg",
  },
  {
    value: "date",
    label: "Data",
    img: "/input-type/date.svg",
  },
  {
    value: "checkbox",
    label: "Múltipla escolha",
    img: "/input-type/checkbox.svg",
  },
  {
    value: "radio",
    label: "Única escolha",
    img: "/input-type/radio.svg",
  },
  {
    value: "statement",
    label: "Separador",
    img: "/input-type/statement.svg",
  },
] as const;

export const queries: Record<
  string,
  Array<{ label: string; value: string }>
> = {
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
