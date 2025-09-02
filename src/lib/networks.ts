import { useEffect, useState } from "react";

interface ShortenUrl {
  shorturl: string;
}

// cache global (per URL)
const cache: Record<string, ShortenUrl> = {};

function isLocalhostUrl() {
  try {
    const hostname = window.location.hostname;
    return ["localhost", "127.0.0.1", "::1"].includes(hostname);
  } catch {
    return false;
  }
}

async function getShortenUrl(longUrl: string): Promise<ShortenUrl> {
  if (isLocalhostUrl()) {
    return { shorturl: window.location.href };
  }

  try {
    const res = await fetch(
      "https://is.gd/create.php?format=json&url=" + encodeURIComponent(longUrl)
    );
    const data = await res.json();

    if (data?.errorcode) {
      throw new Error(data.errorcode);
    }
    return data;
  } catch {
    return { shorturl: window.location.href };
  }
}

export function useShortenUrl(longUrl: string) {
  const [data, setData] = useState<ShortenUrl | null>(
    cache[longUrl] ?? null
  );
  const [isLoading, setIsLoading] = useState(!cache[longUrl]);

  useEffect(() => {
    let mounted = true;

    if (cache[longUrl]) {
      setData(cache[longUrl]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getShortenUrl(longUrl).then((result) => {
      if (!mounted) return;
      cache[longUrl] = result; // simpan di cache global
      setData(result);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [longUrl]);

  return { data, isLoading };
}
