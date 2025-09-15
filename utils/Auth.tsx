import { deleteStoredValueAsync, setStoredValueAsync } from "./Store";
import { getStoredValueAsync } from "./Store"; // <— asigură-te că există

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  byGoogle: boolean;
  byApple: boolean;
  emailVerified: boolean;
};

export type UserTokens = {
  accessToken: string;
  refreshToken: string;
};

export type UserTokensAccess = Partial<UserTokens> & { accessToken: string };

type LoginProps = {
  userData: User;
  tokensData: UserTokensAccess;
};

let user: User | null = null;
let tokens: UserTokens | null = null;

type Listener = (authed: boolean) => void;
const listeners = new Set<Listener>();
const notify = () => {
  const authed = user !== null;
  listeners.forEach((fn) => fn(authed));
};
export const subscribeAuth = (fn: Listener) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const hydrateAuth = async (): Promise<boolean> => {
  try {
    const savedUser = await getStoredValueAsync<User>("user", true);
    const savedTokens = await getStoredValueAsync<UserTokens>("tokens", true);

    if (savedUser && savedTokens?.accessToken) {
      user = savedUser;
      tokens = savedTokens;
      notify();
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const login = async ({ userData, tokensData }: LoginProps): Promise<void> => {
  try {
    await setStoredValueAsync("user", userData, true);
    await setStoredValueAsync("lastUserId", userData.id, true);
    user = userData;

    await setTokens(tokensData);
    notify();
  } catch {
    return Promise.reject();
  }
};

export const logout = async (): Promise<void> => {
  try {
    await deleteStoredValueAsync("user");
    await deleteStoredValueAsync("tokens");
    user = null;
    tokens = null;
    notify();
  } catch {
    return Promise.reject();
  }
};

export const isAuthenticated = (): boolean => user !== null;

export const getAuthUser = (): User => {
  if (!isAuthenticated()) throw new Error("User is not authenticated");
  return user as User;
};

export const getUser = () => user;
export const getTokens = () => tokens;

export const setTokens = async (obj: UserTokensAccess) => {
  if (!obj || typeof obj !== "object") return;
  const next: UserTokens = {
    accessToken: obj.accessToken ?? tokens?.accessToken ?? "",
    refreshToken: obj.refreshToken ?? tokens?.refreshToken ?? "",
  };
  tokens = next;
  await setStoredValueAsync("tokens", next, true);
};
