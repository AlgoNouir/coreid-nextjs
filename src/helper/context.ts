import React from "react";

export type userBaseData<T extends string[]> = {
  id: string;
  username: string;
  permits: T[];
};

export interface AuthContextValueType<T extends string[]> {
  userData: userBaseData<T>;
  setUserData: (value: userBaseData<T>) => void;
}

export function AuthContext<T extends string[]>() {
  return React.createContext<AuthContextValueType<T> | undefined>(undefined);
}
