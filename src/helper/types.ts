import { customeFunc, storagesNames } from "./storage";

export interface AuthHookSettings<T extends string> {
  backendUrl: string;
  storage: storagesNames | customeFunc;
  tokenType: "jwt";
  refreshStrategy: "silent";
  fallback_401_url: string;
  on_after_login?: (response_data: any) => void;
  on_after_step?: (step_key: string) => void;
}
