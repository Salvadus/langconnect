import type { AppSession } from "@/types/session";
import { toHostSessionInput } from "@/session/toHostProps";
import styles from "./styles.module.css";

type Props = {
  session: AppSession;
  adminListEmpty: boolean;
};

export default function PlataformaProps({ session, adminListEmpty }: Props) {
  const hostProps = toHostSessionInput(session);
  const teamSemMatricula =
    session.mode === "team_user" && !session.userMatricula;

  return (
    <div className={styles.wrap}>
      <p className={styles.lead}>
        Estes são os props que o CMS vai passar para o MFE (
        <code>SessionProvider initialSession</code>). Federation ainda não está
        ligada — só o contrato.
      </p>

      {adminListEmpty && (
        <p className={styles.warn}>
          <code>ADMIN_EMAILS</code> vazio: ninguém vira{" "}
          <code>system_admin</code>. Só o e-mail que bater na lista.
        </p>
      )}

      <p className={styles.lead}>
        <code>userMatricula</code> é o ID estável da conta Google (
        <code>sub</code>), não matrícula de RH. Em <code>team_user</code> o
        Python usa isso em <code>X-User-Matricula</code>.
      </p>

      {teamSemMatricula && (
        <p className={styles.warn}>
          Sessão sem ID Google. Saia e entre de novo para gravar o{" "}
          <code>sub</code> no JWT.
        </p>
      )}

      <pre className={styles.pre}>{JSON.stringify(hostProps, null, 2)}</pre>
    </div>
  );
}
