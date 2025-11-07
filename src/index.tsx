"use client";

import { customeFunc, name2storage, storagesNames } from "./helper/storage";
import AuthProvider from "./web";
import { useAuth } from "./hooks/useAuth";
import LoginForm from "./web/login";

export interface AuthHookSettings<T extends string> {
  backendUrl: string;
  storage: storagesNames | customeFunc;
  tokenType: "jwt";
  refreshStrategy: "silent";
  fallback_401_url: string;
  go_after_login_url: string;
}

export default function AuthHook<T extends string>(props: AuthHookSettings<T>) {
  // set storage functions
  let storage = props.storage;
  if (typeof storage === "string") storage = name2storage(storage);

  // create backend data
  return {
    createAuthProvider: (children: React.ReactNode): React.ReactNode => (
      <AuthProvider<T> storage={storage} authera_props={props}>
        {children}
      </AuthProvider>
    ),
    useAuth: () => useAuth<T>(),
    LoginScenario: () => <LoginForm />,
  };
}

export { default as AuthGuard } from "./web/guard";
