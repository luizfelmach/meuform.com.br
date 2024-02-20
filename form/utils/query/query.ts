type QueryFn = (defined: any, answer: any) => boolean;

type QueryResult = {
  fn: QueryFn;
  label: string;
};

const QueriesText: Record<string, QueryResult> = {
  equals: {
    fn: (defined: any, answer: any) => String(defined) === String(answer),
    label: "Igual a",
  },
  notEquals: {
    fn: (defined: any, answer: any) => String(defined) !== String(answer),
    label: "Diferente de ",
  },
  contains: {
    fn: (defined: any, answer: any) => String(answer).includes(String(defined)),
    label: "Tem a palavra",
  },
  startsWith: {
    fn: (defined: any, answer: any) =>
      String(answer).startsWith(String(defined)),
    label: "Inicia com a palavra",
  },
  endsWith: {
    fn: (defined: any, answer: any) => String(answer).endsWith(String(defined)),
    label: "Termina com palavra.",
  },
};

const QueriesTextArea: Record<string, QueryResult> = {
  equals: {
    fn: (defined: any, answer: any) => String(defined) === String(answer),
    label: "Igual a",
  },
  notEquals: {
    fn: (defined: any, answer: any) => String(defined) !== String(answer),
    label: "Diferente de ",
  },
  contains: {
    fn: (defined: any, answer: any) => String(answer).includes(String(defined)),
    label: "Tem a palavra",
  },
  startsWith: {
    fn: (defined: any, answer: any) =>
      String(answer).startsWith(String(defined)),
    label: "Inicia com a palavra",
  },
  endsWith: {
    fn: (defined: any, answer: any) => String(answer).endsWith(String(defined)),
    label: "Termina com palavra.",
  },
};

const QueriesNumber: Record<string, QueryResult> = {
  equals: {
    fn: (defined: any, answer: any) => Number(defined) === Number(answer),
    label: "Igual a",
  },
  notEquals: {
    fn: (defined: any, answer: any) => Number(defined) !== Number(answer),
    label: "Diferente de",
  },
  lt: {
    fn: (defined: any, answer: any) => Number(defined) > Number(answer),
    label: "Menor que",
  },
  gt: {
    fn: (defined: any, answer: any) => Number(defined) < Number(answer),
    label: "Maior que ",
  },
  gte: {
    fn: (defined: any, answer: any) => Number(defined) <= Number(answer),
    label: "Maior ou igual a",
  },
  lte: {
    fn: (defined: any, answer: any) => Number(defined) >= Number(answer),
    label: "Menor ou igual a",
  },
};

const QueriesDate: Record<string, QueryResult> = {
  equals: {
    fn: (defined: any, answer: any) =>
      new Date(defined).getTime() === new Date(answer).getTime(),
    label: "Igual a",
  },
  notEquals: {
    fn: (defined: any, answer: any) =>
      new Date(defined).getTime() !== new Date(answer).getTime(),
    label: "Diferente de",
  },
  lt: {
    fn: (defined: any, answer: any) =>
      new Date(defined).getTime() > new Date(answer).getTime(),
    label: "Menor que",
  },
  gt: {
    fn: (defined: any, answer: any) =>
      new Date(defined).getTime() < new Date(answer).getTime(),
    label: "Maior que ",
  },
  gte: {
    fn: (defined: any, answer: any) =>
      new Date(defined).getTime() <= new Date(answer).getTime(),
    label: "Maior ou igual a",
  },
  lte: {
    fn: (defined: any, answer: any) =>
      new Date(defined).getTime() >= new Date(answer).getTime(),
    label: "Menor ou igual a",
  },
};

const QueriesCheckBox: Record<string, QueryResult> = {
  has: {
    fn: (defined: any, answer: any) => answer.includes(String(defined)),
    label: "Tem",
  },
};

const QueriesRadio: Record<string, QueryResult> = {
  equals: {
    fn: (defined: any, answer: any) => String(defined) === String(answer),
    label: "Igual a",
  },
  notEquals: {
    fn: (defined: any, answer: any) => String(defined) !== String(answer),
    label: "Diferente de ",
  },
  contains: {
    fn: (defined: any, answer: any) => String(answer).includes(String(defined)),
    label: "Tem a palavra",
  },
  startsWith: {
    fn: (defined: any, answer: any) =>
      String(answer).startsWith(String(defined)),
    label: "Inicia com a palavra",
  },
  endsWith: {
    fn: (defined: any, answer: any) => String(answer).endsWith(String(defined)),
    label: "Termina com palavra.",
  },
};

const Queries: Record<string, Record<string, QueryResult>> = {
  text: QueriesText,
  textarea: QueriesTextArea,
  number: QueriesNumber,
  date: QueriesDate,
  radio: QueriesRadio,
  checkbox: QueriesCheckBox,
};

export function getQueryFn(
  type: string,
  query: string
): QueryResult | undefined {
  const input = Queries[type];
  if (!input) return;
  const q = input[query];
  if (!q) return;
  return q;
}
