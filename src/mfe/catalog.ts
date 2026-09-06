/**
 * Registro de remotes. Um nome = um MFE.
 * Loader não conhece regra de negócio — só entry + expose + props.
 */
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

export function getMfeSrc(name: keyof typeof MFE_CATALOG): string {
  const item = MFE_CATALOG[name];
  const fromEnv = process.env[item.srcEnv];
  return String(fromEnv || item.defaultSrc).replace(/\/$/, "");
}

export function getMfeEntry(name: keyof typeof MFE_CATALOG): string {
  const item = MFE_CATALOG[name];
  return `${getMfeSrc(name)}/${item.entryFile}`;
}
