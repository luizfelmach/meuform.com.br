import { AuthLayout } from "@/components/interface/auth-layout";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  if (true) {
    //throw json("Not found", { status: 401 });
  }
  return json({ ok: false });
};

export default function Page() {
  return (
    <AuthLayout.Root>
      <AuthLayout.Main>
        <AuthLayout.LogoFull />
        <AuthLayout.Header>
          <AuthLayout.Title>Bem-vindo novamente!</AuthLayout.Title>
          <AuthLayout.Description>
            Acesse sua plataforma.
          </AuthLayout.Description>
        </AuthLayout.Header>
        <h1 className="font-sans">sans</h1>
        <h1 className="font-serif">serif</h1>
        <h1 className="font-mono">mon</h1>
        <h1 className="font-thin">thin</h1>
        <h1 className="font-extralight">font-extralight</h1>
        <h1 className="font-light">font-light</h1>
        <h1 className="font-normal">font-normal</h1>
        <h1 className="font-medium">font-medium</h1>
        <h1 className="font-semibold">font-semibold</h1>
        <h1 className="font-bold">font-bold</h1>
        <h1 className="font-extrabold">font-extrabold</h1>
        <h1 className="font-black">font-black</h1>
      </AuthLayout.Main>
      <AuthLayout.Aside>
        <AuthLayout.Banner />
      </AuthLayout.Aside>
    </AuthLayout.Root>
  );
}
