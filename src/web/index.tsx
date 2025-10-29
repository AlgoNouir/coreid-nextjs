import React from "react";
import { AuthContext, userBaseData } from "../helper/context";
import type { customeFunc as storageFunc } from "../helper/storage";

interface AuthProviderProps<T extends string[]> {
  children: React.ReactNode;
  storage: storageFunc;
}

export default function AuthProvider<T extends string[]>({
  children,
  storage,
}: AuthProviderProps<T>) {
  /**
   * Context Provider
   */
  const Provider = AuthContext<T>().Provider;
  const userData = storage.get("userData") as userBaseData<T>;
  const setUserData = (value: userBaseData<T>) => {
    storage.set("userData", value);
  };

  return <Provider value={{ userData, setUserData }}>{children}</Provider>;
}
