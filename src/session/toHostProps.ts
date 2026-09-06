import type { AppSession, HostSessionInput, SessionMode } from "../types/session";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export function resolveSessionMode(email: string): SessionMode {
  return adminEmails().includes(email.trim().toLowerCase())
    ? "system_admin"
    : "team_user";
}

/** Google → props que o MFE espera em SessionProvider.
 *  userMatricula = Google `sub` (POC; não é matrícula de RH). */
export function toHostProps(input: {
  email?: string | null;
  name?: string | null;
  matricula?: string | null;
}): AppSession | null {
  const userEmail = (input.email || "").trim();
  if (!userEmail) return null;
  const userName = (input.name || "").trim();
  const userMatricula = (input.matricula || "").trim();
  return {
    mode: resolveSessionMode(userEmail),
    userEmail,
    userName,
    userMatricula,
  };
}

export function toHostSessionInput(session: AppSession): HostSessionInput {
  return {
    mode: session.mode,
    userEmail: session.userEmail,
    userName: session.userName,
    userMatricula: session.userMatricula,
  };
}
