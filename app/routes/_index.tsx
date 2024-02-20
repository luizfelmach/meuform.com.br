import { redirect } from "@remix-run/node";

export async function loader() {
  return redirect("/signin");
}

export default function Index() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <h1 className="font-bold text-2xl">Em breve...</h1>
    </div>
  );
}
