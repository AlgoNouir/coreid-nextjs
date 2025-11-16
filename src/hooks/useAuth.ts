"use client";

import {
  AuthContext,
  userBaseData,
  type AuthContextValueType,
} from "../helper/context";
import React from "react";

export function useAuth<T extends string>() {
  // -------------------------------------------------- context

  const ctx = React.useContext(
    AuthContext as React.Context<AuthContextValueType<T> | undefined>
  );
  if (!ctx) throw new Error("useAuth must be used within an AuthContext");

  // -------------------------------------------------- data

  const { permits: permitsData, ...user } = ctx.userData;
  const access_token = ctx.access_token;
  const refresh_token = ctx.refresh_token;
  const authera_props = ctx.authera_props;
  const prm = (permitsData || []) as T[];

  // -------------------------------------------------- funtions
  const isPermitted = (perm: T) => {
    return prm.includes(perm);
  };
  const isPermittedAll = (perms: T[]) => {
    return perms.every((p) => prm.includes(p));
  };

  const on = (perm: T, callback: () => void, fallback?: () => void) => {
    if (isPermitted(perm)) callback();
    else if (fallback) fallback();
  };

  const setUserData = (userData: userBaseData<T>) => {
    ctx.set("userData", userData);
  };

  const setPermits = (permits: T[]) => {
    ctx.set("userData", { ...ctx.userData, permits });
  };

  const addPermits = (permits: T[]) => {
    if (typeof permits !== "object") return;

    ctx.set("userData", {
      ...ctx.userData,
      permits: [...prm.filter((p) => !permits.includes(p)), ...permits],
    });
  };

  const removePermits = (permits: T[]) => {
    ctx.set("userData", {
      ...ctx.userData,
      permits: prm.filter((p) => !permits.includes(p)),
    });
  };

  const setAccessToken = (token: string) => {
    ctx.set("access_token", token);
  };

  const setRefreshToken = (token: string) => {
    ctx.set("refresh_token", token);
  };

  const logout = () => {
    setUserData(null as any);
    setPermits([]);
    ctx.set("refresh_token", null);
    ctx.set("access_token", null);
  };

  return {
    permits: prm,
    isPermitted,
    on,
    setPermits,
    addPermits,
    removePermits,
    setUserData,
    isPermittedAll,
    user,
    setAccessToken,
    setRefreshToken,
    logout,
    access_token,
    refresh_token,
    ...authera_props,
  };
}
