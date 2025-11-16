"use client";

import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import type { customeFunc } from "./storage";
import type { AuthHookSettings } from "./types";

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

/**
 * Create a preconfigured Axios instance that:
 * - Attaches Authorization header from storage on each request
 * - On 401 responses, attempts token refresh and retries the original request
 * - If refresh fails, redirects to fallback_401_url
 */
export default function createAxios<T extends string>(
  storage: customeFunc,
  settings: AuthHookSettings<T>
): AxiosInstance {
  const instance = axios.create({
    baseURL: settings.backendUrl,
  });

  // Single-flight refresh across concurrent 401s
  let refreshPromise: Promise<string | null> | null = null;

  const readAccessToken = (): string | null => {
    try {
      const token = storage.get("access_token");
      return token || null;
    } catch {
      return null;
    }
  };

  const readRefreshToken = (): string | null => {
    try {
      const token = storage.get("refresh_token");
      return token || null;
    } catch {
      return null;
    }
  };

  const writeTokens = (access?: string | null, refresh?: string | null) => {
    if (access) storage.set("access_token", access);
    if (refresh) storage.set("refresh_token", refresh);
  };

  const resolveAccessFromResponse = (data: any): string | null => {
    return data?.access_token ?? data?.accessToken ?? data?.token ?? null;
  };

  const resolveRefreshFromResponse = (data: any): string | null => {
    return data?.refresh_token ?? data?.refreshToken ?? null;
  };

  const doRefresh = async (): Promise<string | null> => {
    const token = readRefreshToken();
    if (!token) return null;
    try {
      // Use a bare client to avoid interceptor recursion
      const client = axios.create({ baseURL: settings.backendUrl });
      const resp = await client.post("auth/refresh/", { refresh_token: token });
      const newAccess = resolveAccessFromResponse(resp.data);
      const newRefresh = resolveRefreshFromResponse(resp.data);
      writeTokens(newAccess, newRefresh);
      return newAccess;
    } catch {
      return null;
    }
  };

  const getOrStartRefresh = (): Promise<string | null> => {
    if (!refreshPromise) {
      refreshPromise = doRefresh().finally(() => {
        // allow subsequent refreshes
        refreshPromise = null;
      });
    }
    return refreshPromise;
  };

  // Attach Authorization header on each request
  instance.interceptors.request.use((config: any) => {
    const access = readAccessToken();
    if (access) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${access}`,
      };
    }
    return config;
  });

  // Handle 401 responses with token refresh
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const responseStatus = error.response?.status;
      const originalConfig = (error.config || {}) as any;

      if (responseStatus === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        const newAccess = await getOrStartRefresh();
        if (newAccess) {
          originalConfig.headers = {
            ...(originalConfig.headers || {}),
            Authorization: `Bearer ${newAccess}`,
          };
          // retry original request with new token
          return instance.request(originalConfig);
        }
        // refresh failed: redirect to login/fallback
        if (typeof window !== "undefined" && settings.fallback_401_url) {
          window.location.href = settings.fallback_401_url;
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
}
