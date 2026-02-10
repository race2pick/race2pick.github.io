import { loadAssets } from "@/lib/assets";
import { useEffect, useRef, useState } from "react";

export default function useLoadAssets() {
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current) {
      setIsLoadingAssets(false);
      return;
    }

    const load = async () => {
      await loadAssets();
      doneRef.current = true;
      setIsLoadingAssets(false);
    };

    load();
  }, []);

  return isLoadingAssets;
}
