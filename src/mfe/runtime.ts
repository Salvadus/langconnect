import { init, loadRemote } from "@module-federation/runtime";
import { MFE_CATALOG, getMfeEntry, getMfeSrc } from "./catalog";
import type { MfeHostProps, MfeName } from "./types";
import { installViteReactPreamble } from "./vitePreamble";

export type MfeMount = (
  el: HTMLElement,
  props: { initialSession: MfeHostProps }
) => () => void;

let ready = false;

export function initMfeRuntime(): void {
  if (ready) return;
  init({
    name: "cmsHost",
    remotes: (Object.keys(MFE_CATALOG) as MfeName[]).map((name) => ({
      name,
      alias: name,
      entry: getMfeEntry(name),
      type: "module",
    })),
  });
  ready = true;
}

function pageIsLocal(): boolean {
  if (typeof window === "undefined") return false;
  return /localhost|127\.0\.0\.1/.test(window.location.hostname);
}

function isViteDevOrigin(origin: string): boolean {
  return /localhost|127\.0\.0\.1/.test(origin);
}

export async function loadMfeMount(name: MfeName): Promise<MfeMount> {
  const src = getMfeSrc(name);
  // Preamble só com CMS e remote no Vite local. No celular/Vercel o /@vite/client não existe.
  if (pageIsLocal() && isViteDevOrigin(src)) {
    await installViteReactPreamble(src);
  }
  initMfeRuntime();
  const expose = MFE_CATALOG[name].expose;
  const mod = (await loadRemote(`${name}/${expose}`)) as {
    mount?: MfeMount;
    default?: { mount?: MfeMount };
  } | null;
  const mount = mod?.mount || mod?.default?.mount;
  if (!mount) {
    throw new Error(`Remote ${name}/${expose} sem export mount`);
  }
  return mount;
}
