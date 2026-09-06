import { auth } from "@/auth";
import SessionGate from "@/components/sessao/gate";
import MfeLoader from "@/components/mfe-loader";
import { buildMfeProps } from "@/mfe/props";
import { toHostProps } from "@/session/toHostProps";
import styles from "./styles.module.css";

export default async function PlataformaView() {
  return (
    <SessionGate>
      <PlataformaInner />
    </SessionGate>
  );
}

async function PlataformaInner() {
  const raw = await auth();
  const session = toHostProps({
    email: raw?.user?.email,
    name: raw?.user?.name,
    matricula: raw?.user?.id,
  });

  if (!session) {
    return <p>Sessão sem e-mail.</p>;
  }

  const mfeProps = buildMfeProps(session);

  return (
    <div className={styles.shell}>
      <MfeLoader name="plataformaIa" props={mfeProps.plataformaIa} />
    </div>
  );
}
