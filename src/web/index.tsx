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
  const [userData, setUserData] = React.useState<userBaseData<T> | null>(
    storage.get("userData") as userBaseData<T> | null
  );
  const [accessToken, setAccessToken] = React.useState<string | null>(
    (storage.get("access_token") as string | null) ?? null
  );
  const [refreshToken, setRefreshToken] = React.useState<string | null>(
    (storage.get("refresh_token") as string | null) ?? null
  );

  const set = (key: keyof AuthContextValueType<T>, value: any) => {
    if (key === "userData") setUserData(value as userBaseData<T> | null);
    if (key === "access_token") setAccessToken(value as string | null);
    if (key === "refresh_token") setRefreshToken(value as string | null);
    storage.set(key as string, value);
  };

  return (
    <Provider
      value={{
        userData: (userData ||
          ({
            id: "",
            username: "",
            permits: [],
          } as userBaseData<T>)) as userBaseData<T>,
        access_token: accessToken,
        refresh_token: refreshToken,
        set,
        authera_props,
      }}
    >
      {children}
    </Provider>
  );
}
