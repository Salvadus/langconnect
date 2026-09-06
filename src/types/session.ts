/**
 * Mesmo contrato do MFE (plataforma-ia/src/session/fromHost.ts).
 * O CMS monta este objeto; o remote só recebe props.
 */
export type SessionMode = "system_admin" | "team_user";

export type HostSessionInput = {
  mode?: string;
  userEmail?: string;
  email?: string;
  userName?: string;
  nome?: string;
  name?: string;
  userMatricula?: string;
  matricula?: string;
};

export interface AppSession {
  mode: SessionMode;
  userEmail: string;
  userName: string;
  userMatricula: string;
}

export function parseSessionMode(value: string | undefined): SessionMode {
  return value === "team_user" ? "team_user" : "system_admin";
}
