"use client";

import { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

export interface AuthGuardProps {
  children: ReactNode;
  permits: string[];
  action: "show" | "hide" | "redirect";
}

export default function AuthGuard({
  children,
  permits,
  action,
}: AuthGuardProps) {
  // const { isPermittedAll: isPermittedHook, fallback_401_url } =
  //   useAuth<string>();
  // const isPermitted = isPermittedHook(permits);
  // if (action === "redirect" && !isPermitted) {
  //   window.location.href = fallback_401_url;
  //   return null;
  // }
  // if (action === "show") {
  //   if (isPermitted) return <>{children}</>;
  //   else return null;
  // }
  // if (action === "hide") {
  //   if (isPermitted) return null;
  //   else return <>{children}</>;
  // }
}
