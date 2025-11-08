import React from "react";
import { type AuthHookSettings } from "..";

export type userBaseData<T extends string> = {
  id: string;
  username: string;
  permits: T[];
};

export interface AuthContextValueType<T extends string> {
  authera_props: AuthHookSettings<T>;
  userData: userBaseData<T>;
  set: (key: keyof AuthContextValueType<T>, value: any) => void;
  access_token?: string | null;
  refresh_token?: string | null;
}

export const AuthContext = React.createContext<
  AuthContextValueType<any> | undefined
>(undefined);
