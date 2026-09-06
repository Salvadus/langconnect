import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import CmsLayout from "@/layout/layout";
import "@/styles/global.css";

export const metadata: Metadata = {
  title: "LangConnect",
  description: "Host Next.js da plataforma",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <CmsLayout>{children}</CmsLayout>
      </body>
    </html>
  );
}
