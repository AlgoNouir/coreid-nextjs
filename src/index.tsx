"use client";

import { customeFunc, name2storage, storagesNames } from "./helper/storage";
import AuthProvider from "./web";
import { useAuth } from "./hooks/useAuth";
import LoginForm from "./web/login";
import { type AuthHookSettings } from "./helper/types";

export default function AuthHook<T extends string>(props: AuthHookSettings<T>) {
  // set storage functions
  let storage = props.storage;
  if (typeof storage === "string") storage = name2storage(storage);

  // create backend data
  return {
    createAuthProvider: (children: React.ReactNode): React.ReactNode => (
      <AuthProvider<T> storage={storage} authera_props={props}>
        {children}
      </AuthProvider>
    ),
    useAuth: () => useAuth<T>(),
    LoginScenario: (prop: {
      submitButtonClassName?: string;
      submitButtonText?: string;
    }) => (
      <LoginForm
        on_after_login={props.on_after_login}
        on_after_step={props.on_after_step}
        backendUrl={props.backendUrl}
        submitButtonClassName={prop.submitButtonClassName}
        submitButtonText={prop.submitButtonText}
      />
    ),
  };
}

export { default as AuthGuard } from "./web/guard";
