"use client";

import React from "react";
import { AuthContext, userBaseData } from "../helper/context";
import type { customeFunc as storageFunc } from "../helper/storage";
import { type AuthHookSettings } from "..";

interface AuthProviderProps<T extends string> {
  children: React.ReactNode;
  storage: storageFunc;
  authera_props: AuthHookSettings<T>;
}

export default function AuthProvider<T extends string>({
  children,
  storage,
  authera_props,
}: AuthProviderProps<T>) {
  /**
   * Context Provider
   */
  const Provider = AuthContext.Provider;
  const userData = storage.get("userData") as userBaseData<T>;
  const setUserData = (value: userBaseData<T>) => {
    storage.set("userData", value);
  };

  return (
    <Provider value={{ userData, setUserData, authera_props }}>
      {children}
    </Provider>
  );
}
