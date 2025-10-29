"use client";

import Cookie from "js-cookie";

export type storagesNames = "cookie" | "local";
export type customeFunc = {
  get: (key: string) => object | undefined;
  set: (key: string, value: object) => void;
};
export function name2storage(name: storagesNames) {
  const cookie: customeFunc = {
    get: (key) => JSON.parse(Cookie.get(key) || "{}"),
    set: (key, value) => Cookie.set(key, JSON.stringify(value)),
  };

  const local: customeFunc = {
    get: (key) => JSON.parse(localStorage.getItem(key) || "{}"),
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  };

  const mapStorage: { [key in storagesNames]: customeFunc } = {
    cookie,
    local,
  };

  return mapStorage[name];
}
