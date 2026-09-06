import type { AppSession } from "../types/session";
import { toHostSessionInput } from "../session/toHostProps";
import type { MfeHostProps, MfeName } from "./types";

/** Props padrão por MFE. Novo remote = nova chave aqui. */
export function buildMfeProps(session: AppSession): Record<MfeName, MfeHostProps> {
  const host = toHostSessionInput(session);
  return {
    plataformaIa: host,
  };
}
