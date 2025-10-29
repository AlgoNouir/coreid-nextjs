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
  const { isPermitted: isPermittedHook } = useAuth<string>();

  const isPermitted = isPermittedHook(permits);

  if (action === "show" && isPermitted) return <>{children}</>;
  if (action === "hide" && !isPermitted) return null;
  if (action === "redirect" && !isPermitted) return <>{children}</>;

  return null;
}
