"use client";

import React from "react";
import { AuthContext, userBaseData } from "../helper/context";
import type { customeFunc as storageFunc } from "../helper/storage";
import { AuthHookSettings } from "..";

interface AuthProviderProps<T extends string> {
  children: React.ReactNode;
  storage: storageFunc;
  fallback_401_url: string;
}

export default function AuthProvider<T extends string>({
  children,
  storage,
  fallback_401_url,
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
    <Provider value={{ userData, setUserData, fallback_401_url }}>
      {children}
    </Provider>
  );
}
