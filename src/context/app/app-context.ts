import type { Data } from "@/lib/type";
import { createContext, useContext } from "react";

interface App {
  isReady: boolean;
  setDataSearchParams: (data: string) => void;
  getDataSearchParams: () => Data | undefined;
  getSlugSearchParams: () => string | null;
  clearSearchParams: () => void;
  setIsReady: (isReady: boolean) => void;

}

const AppContext = createContext<App | undefined>(undefined);

const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
};

export { AppContext, useApp };
