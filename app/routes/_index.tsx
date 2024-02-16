import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Meu Form" },
    { name: "Crie formulários personalizados.", content: "Página inicial" },
  ];
};

export default function Index() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <h1 className="font-bold text-2xl">Em breve...</h1>
    </div>
  );
}
