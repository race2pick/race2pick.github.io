import { useEffect, useState } from "react";

interface ShortenUrl {
  shorturl: string;
}

// cache global (per URL)
const cache: Record<string, ShortenUrl> = {};
const cacheSlug: Record<string, string> = {};

function isLocalhostUrl() {
  try {
    const hostname = window.location.hostname;
    return ["localhost", "127.0.0.1", "::1"].includes(hostname);
  } catch {
    return false;
  }
}

async function getDataBySlug(slug: string): Promise<string | undefined | null> {
  try {
    const res = await fetch(`https://race2pick.race2pick.workers.dev/${slug}`);
    const data = await res.json();

    return data?.data;
  } catch {
    return undefined;
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
  const [data, setData] = useState<ShortenUrl | null>(cache[longUrl] ?? null);
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
      cache[longUrl] = result;
      setData(result);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [longUrl]);

  return { data, isLoading };
}

export function useSlugData(slug: string, enabled: boolean) {
  const [data, setData] = useState<string | null>(cacheSlug[slug] ?? null);

  const [isLoading, setIsLoading] = useState(!cacheSlug[slug]);

  useEffect(() => {
    if (!enabled) return;

    let mounted = true;

    if (cacheSlug[slug]) {
      setData(cacheSlug[slug]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getDataBySlug(slug)
      .then((result) => {
        if (!mounted) return;

        if (result) {
          cacheSlug[slug] = result;
          setData(result);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug, enabled]);

  return { data, isLoading };
}
