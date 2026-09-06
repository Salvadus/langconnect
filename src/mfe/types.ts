import type { HostSessionInput } from "../types/session";
import type { MFE_CATALOG } from "./catalog";

export type MfeName = keyof typeof MFE_CATALOG;

export type MfeHostProps = HostSessionInput;

export const MFE_MSG_READY = "mfe:ready";
export const MFE_MSG_SESSION = "mfe:session";
export const MFE_MSG_SIGNOUT = "mfe:signOut";

export type MfeReadyMessage = {
  type: typeof MFE_MSG_READY;
  name: MfeName;
};

export type MfeSessionMessage = {
  type: typeof MFE_MSG_SESSION;
  name: MfeName;
  props: MfeHostProps;
};

export type MfeSignOutMessage = {
  type: typeof MFE_MSG_SIGNOUT;
  name: MfeName;
};
