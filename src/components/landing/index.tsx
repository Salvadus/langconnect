import Link from "next/link";
import { signIn } from "@/auth";
import styles from "./styles.module.css";

type LandingProps = {
  loggedIn?: boolean;
};

export default function Landing({ loggedIn = false }: LandingProps) {
  if (loggedIn) {
    return (
      <div className={styles.wrap}>
        <img
          src="/logo-langconect.png"
          alt="LangConnect"
          className={styles.logo}
        />
        <Link href="/plataforma" className={styles.entrar}>
          Entrar
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <img src="/logo-langconect.png" alt="LangConnect" className={styles.logo} />
      <form
        className={styles.form}
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/plataforma" });
        }}
      >
        <button type="submit" className={styles.entrar}>
          Entrar
        </button>
      </form>
    </div>
  );
}
