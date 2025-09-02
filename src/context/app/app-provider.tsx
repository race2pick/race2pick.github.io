import type { Data } from "@/lib/type";
import { AppContext } from "./app-context";
import { decompressData } from "@/lib/utils";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const getDataSearchParams = (): Data | undefined => {
    const searchParams = new URLSearchParams(window.location.search);
    const data = searchParams.get("d");
    return decompressData(data);
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
      value={{ setDataSearchParams, getDataSearchParams, clearSearchParams }}
    >
      {children}
    </AppContext.Provider>
  );
}
