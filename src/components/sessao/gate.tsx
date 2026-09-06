import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/auth";

type SessionGateProps = {
  children: ReactNode;
};

/** Sem login Google → /login. Espelho do SessionGate que o MFE terá. */
export default async function SessionGate({ children }: SessionGateProps) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }
  return <>{children}</>;
}
