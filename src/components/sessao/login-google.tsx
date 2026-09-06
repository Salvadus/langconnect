import { signIn } from "@/auth";
import BotaoCustomizado from "../uteis/botao-customizado";

export default function LoginGoogle() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: "/plataforma" });
      }}
    >
      <BotaoCustomizado type="submit" texto="Entrar com Google" />
    </form>
  );
}
