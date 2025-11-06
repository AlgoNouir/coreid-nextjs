import { AuthHookSettings } from "..";
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

  const { permits: permitsData } = ctx.userData;
  const prm = (permitsData || []) as T[];
  const fallback_401_url = ctx.fallback_401_url;

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

  const setPermits = (permits: T[]) => {
    ctx.setUserData({ ...ctx.userData, permits });
  };

  const addPermits = (permits: T[]) => {
    if (typeof permits !== "object") return;

    ctx.setUserData({
      ...ctx.userData,
      permits: [...prm.filter((p) => !permits.includes(p)), ...permits],
    });
  };

  const removePermits = (permits: T[]) => {
    ctx.setUserData({
      ...ctx.userData,
      permits: prm.filter((p) => !permits.includes(p)),
    });
  };

  const setUserData = (userData: userBaseData<T>) => {
    ctx.setUserData(userData);
  };

  return {
    permits: prm,
    isPermitted,
    on,
    setPermits,
    addPermits,
    removePermits,
    setUserData,
    fallback_401_url,
    isPermittedAll,
  };
}
