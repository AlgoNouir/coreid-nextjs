import React from "react";

export type userBaseData<T extends string> = {
  id: string;
  username: string;
  permits: T[];
};

export interface AuthContextValueType<T extends string> {
  fallback_401_url: string;
  userData: userBaseData<T>;
  setUserData: (value: userBaseData<T>) => void;
}

export const AuthContext = React.createContext<
  AuthContextValueType<any> | undefined
>(undefined);
