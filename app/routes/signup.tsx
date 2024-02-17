import { MetaFunction, json } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Meu Form | Criar conta" },
    {
      name: "Crie uma conta na plataforma Meu Form.",
      content: "Página para criar uma conta.",
    },
  ];
};

export async function loader() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return json({});
}

export default function Page() {
  return <div>OK</div>;
}
