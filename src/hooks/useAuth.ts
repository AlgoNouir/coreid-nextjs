import { AuthContext, type AuthContextValueType } from "../helper/context";
import React from "react";

export function useAuth<T extends string[]>() {
  const ctx = React.useContext(AuthContext<T>());
  if (!ctx) throw new Error("useAuth must be used within an AuthContext");

  const { permits: prm } = ctx.userData;

  const isPermitted = (perm: T) => {
    return prm.includes(perm);
  };

  const on = (perm: T, callback: () => void, fallback: () => void) => {
    if (prm.includes(perm)) {
      callback();
    } else {
      fallback();
    }
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
