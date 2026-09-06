import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Landing from "@/components/landing";

export default async function LoginView() {
  const session = await auth();
  if (session?.user?.email) {
    redirect("/plataforma");
  }
  return <Landing />;
}
