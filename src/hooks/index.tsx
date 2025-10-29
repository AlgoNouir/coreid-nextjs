import { customeFunc, name2storage, storagesNames } from "../helper/storage";
import AuthProvider from "../web";
import { useAuth } from "./useAuth";

export interface AuthHookSettings<T extends string[]> {
  backendUrl: string;
  storage: storagesNames | customeFunc;
  tokenType: "jwt";
  refreshStrategy: "silent"; // یا manual
}

export function AuthHook<T extends string[]>(props: AuthHookSettings<T>) {
  // set storage functions
  let storage = props.storage;
  if (typeof storage === "string") storage = name2storage(storage);

  return {
    AuthProvider: ({ children }: { children: React.ReactNode }) => (
      <AuthProvider<T> storage={storage}>{children}</AuthProvider>
    ),
    useAuth: () => useAuth<T>(),
  };
}
