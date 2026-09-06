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

export async function loadMfeMount(name: MfeName): Promise<MfeMount> {
  await installViteReactPreamble(getMfeSrc(name));
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
