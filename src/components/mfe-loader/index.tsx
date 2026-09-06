"use client";

import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { MFE_CATALOG } from "@/mfe/catalog";
import { MFE_MSG_SIGNOUT, type MfeHostProps, type MfeName } from "@/mfe/types";
import styles from "./styles.module.css";

type MfeLoaderProps = {
  name: MfeName;
  props: MfeHostProps;
};

export default function MfeLoader({ name, props }: MfeLoaderProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const title = MFE_CATALOG[name].title;

  useEffect(() => {
    function onHostSignOut(event: Event) {
      const custom = event as CustomEvent<{ type?: string; name?: string }>;
      if (custom.detail?.type && custom.detail.type !== MFE_MSG_SIGNOUT) return;
      if (custom.detail?.name && custom.detail.name !== name) return;
      void signOut({ callbackUrl: "/login" });
    }

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== MFE_MSG_SIGNOUT) return;
      if (event.data?.name && event.data.name !== name) return;
      void signOut({ callbackUrl: "/login" });
    }

    window.addEventListener(MFE_MSG_SIGNOUT, onHostSignOut);
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener(MFE_MSG_SIGNOUT, onHostSignOut);
      window.removeEventListener("message", onMessage);
    };
  }, [name]);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    let cancelled = false;
    let unmount: (() => void) | undefined;

    setError(null);
    import("@/mfe/runtime")
      .then(({ loadMfeMount }) => loadMfeMount(name))
      .then((mount) => {
        if (cancelled || !hostRef.current) return;
        unmount = mount(hostRef.current, { initialSession: props });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Falha ao carregar o MFE";
        setError(message);
      });

    return () => {
      cancelled = true;
      unmount?.();
    };
  }, [name, props]);

  return (
    <div className={styles.shell}>
      {error ? (
        <p className={styles.error}>
          Não carregou {title}. Suba o Vite do remote e recarregue.
          <br />
          {error}
        </p>
      ) : null}
      <div ref={hostRef} className={styles.host} />
    </div>
  );
}
