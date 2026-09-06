/**
 * Registro de remotes. Um nome = um MFE.
 * Loader não conhece regra de negócio — só entry + expose + props.
 */
export const MFE_PROD_ORIGIN = "https://plataforma-ia-umber.vercel.app";

export const MFE_CATALOG = {
  plataformaIa: {
    id: "plataforma-ia",
    title: "Plataforma IA",
    srcEnv: "NEXT_PUBLIC_MFE_PLATAFORMA_IA_URL",
    defaultSrc: "http://localhost:5173",
    entryFile: "remoteEntry.js",
    expose: "mount",
  },
} as const;

function isLocalHostName(value: string): boolean {
  return /localhost|127\.0\.0\.1/.test(value);
}

function pageIsLocal(): boolean {
  if (typeof window === "undefined") return false;
  return isLocalHostName(window.location.hostname);
}

export function getMfeSrc(name: keyof typeof MFE_CATALOG): string {
  const item = MFE_CATALOG[name];
  const fromEnv = String(process.env[item.srcEnv] || "").replace(/\/$/, "");
  const src = fromEnv || item.defaultSrc;
  // CMS na Vercel com env ainda em localhost: o celular não alcança :5173.
  if (!pageIsLocal() && isLocalHostName(src)) {
    return MFE_PROD_ORIGIN;
  }
  return src.replace(/\/$/, "");
}

export function getMfeEntry(name: keyof typeof MFE_CATALOG): string {
  const item = MFE_CATALOG[name];
  return `${getMfeSrc(name)}/${item.entryFile}`;
}
