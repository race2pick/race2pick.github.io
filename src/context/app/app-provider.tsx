import type { Data } from "@/lib/type";
import { AppContext } from "./app-context";
import { decompressData } from "@/lib/utils";
import { useState } from "react";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  const getDataSearchParams = (): Data | undefined => {
    const searchParams = new URLSearchParams(window.location.search);
    let data = searchParams.get("d");

    if (!data) {
      const hash = window.location.hash.slice(1); // delete "#"
      const params = new URLSearchParams(hash);
      data = params.get("d");
    }
    return decompressData(data);
  };

  const getSlugSearchParams = (): string | null => {
    const searchParams = new URLSearchParams(window.location.search);
    const data = searchParams.get("s");
    return data;
  };

  const setDataSearchParams = (data: string) => {
    const url = new URL(window.location.origin);
    url.hash = `d=${data}`;
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
