import { auth } from "@/auth";
import Landing from "@/components/landing";

export default async function HomeView() {
  const session = await auth();
  return <Landing loggedIn={Boolean(session?.user?.email)} />;
}
