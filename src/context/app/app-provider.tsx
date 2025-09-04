import type { Data } from "@/lib/type";
import { AppContext } from "./app-context";
import { decompressData } from "@/lib/utils";
import { useState } from "react";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  const getDataSearchParams = (): Data | undefined => {
    const searchParams = new URLSearchParams(window.location.search);
    const data = searchParams.get("d");
    return decompressData(data);
  };

  const getSlugSearchParams = (): string | null => {
    const searchParams = new URLSearchParams(window.location.search);
    const data = searchParams.get("s");
    return data;
  };

  const setDataSearchParams = (data: string) => {
    const url = new URL(window.location.origin);
    url.searchParams.set("d", data);
    window.history.pushState({}, "", url);
  };

  const clearSearchParams = () => {
    const url = new URL(window.location.origin);
    window.history.pushState({}, "", url);
  };

  return (
    <AppContext.Provider
      value={{
        isReady,
        setDataSearchParams,
        getDataSearchParams,
        getSlugSearchParams,
        clearSearchParams,
        setIsReady,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
