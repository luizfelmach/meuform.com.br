import { json } from "@remix-run/node";

export async function loader() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return json({});
}

export default function Page() {
  return <div>OK</div>;
}
