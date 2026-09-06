import Link from "next/link";
import { auth } from "@/auth";
import LogoutButton from "@/components/sessao/logout-button";
import styles from "./styles.module.css";

export default async function Header() {
  const session = await auth();
  const email = session?.user?.email || "";

  return (
    <header className={styles.container}>
      <div className={styles.navLinks}>
        <Link href="/" className={styles.brand} aria-label="LangConnect">
          <img
            src="/logo-langconect.png"
            alt="LangConnect"
            className={styles.logo}
          />
        </Link>
      </div>
      <div className={styles.rightArea}>
        {email ? (
          <>
            <span className={styles.user}>{email}</span>
            <LogoutButton />
          </>
        ) : (
          <Link href="/login" className={styles.user}>
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}
