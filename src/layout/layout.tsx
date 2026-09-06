import type { ReactNode } from "react";
import styles from "./layout.module.css";

type CmsLayoutProps = {
  children: ReactNode;
};

export default function CmsLayout({ children }: CmsLayoutProps) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
