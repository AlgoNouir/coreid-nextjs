"use client";

import { customeFunc, name2storage, storagesNames } from "./helper/storage";
import AuthProvider from "./web";
import { useAuth } from "./hooks/useAuth";
import axios from "axios"

export interface AuthHookSettings<T extends string> {
  backendUrl: string;
  storage: storagesNames | customeFunc;
  tokenType: "jwt";
  refreshStrategy: "silent";
  fallback_401_url: string;
}

export default function AuthHook<T extends string>(props: AuthHookSettings<T>) {
  // set storage functions
  let storage = props.storage;
  if (typeof storage === "string") storage = name2storage(storage);

  // fetch optoins from backend
  const backend_url = props.backendUrl + "/options"
  const response = axios.get(backend_url)

// create backend data
  return {
    createAuthProvider: (children: React.ReactNode): React.ReactNode => (
      <AuthProvider<T>
        storage={storage}
        fallback_401_url={props.fallback_401_url}
      >
        {children}
      </AuthProvider>
    ),
    useAuth: () => useAuth<T>(),
    LoginScenario: () => <p></p>
  };
}

export { default as AuthGuard } from "./web/guard";
