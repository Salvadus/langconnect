import { signOut } from "@/auth";
import BotaoCustomizado from "../uteis/botao-customizado";

export default function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <BotaoCustomizado type="submit" texto="Sair" variant="secondary" />
    </form>
  );
}
