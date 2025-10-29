import { AuthContext, type AuthContextValueType } from "../helper/context";
import React from "react";

export function useAuth<T extends string>() {
  const ctx = React.useContext(
    AuthContext as React.Context<AuthContextValueType<T> | undefined>
  );
  if (!ctx) throw new Error("useAuth must be used within an AuthContext");

  const { permits: prm } = ctx.userData;

  const isPermitted = (perm: T | T[]) => {
    if (Array.isArray(perm)) {
      return perm.every((p) => prm.includes(p));
    }
    return prm.includes(perm);
  };

  const on = (perm: T | T[], callback: () => void, fallback: () => void) => {
    if (isPermitted(perm)) callback();
    else fallback();
  };

  const setPermits = (permits: T[]) => {
    ctx.setUserData({ ...ctx.userData, permits });
  };

  const addPermits = (permits: T[]) => {
    ctx.setUserData({ ...ctx.userData, permits: [...prm, ...permits] });
  };

  const removePermits = (permits: T[]) => {
    ctx.setUserData({
      ...ctx.userData,
      permits: prm.filter((p) => !permits.includes(p)),
    });
  };

  return {
    permits: prm,
    isPermitted,
    on,
    setPermits,
    addPermits,
    removePermits,
  };
}
