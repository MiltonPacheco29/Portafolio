"use client";

import { useSyncExternalStore } from "react";
import { themeInitScript } from "@/lib/theme";

const subscribe = () => () => {};
const onClient = () => false;
const onServer = () => true;

export function ThemeScript() {
  const fromServerHtml = useSyncExternalStore(subscribe, onClient, onServer);
  if (!fromServerHtml) return null;
  return <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />;
}
