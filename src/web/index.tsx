"use client";

import React from "react";
import {
  AuthContext,
  AuthContextValueType,
  userBaseData,
} from "../helper/context";
import type { customeFunc as storageFunc } from "../helper/storage";
import { type AuthHookSettings } from "../helper/types";

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
  const set = (key: keyof AuthContextValueType<T>, value: userBaseData<T>) => {
    storage.set(key, value);
  };

  return (
    <Provider value={{ userData, set, authera_props }}>{children}</Provider>
  );
}
