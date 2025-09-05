import { useEffect, useState } from "react";

const cache: Record<string, string> = {};
const cacheSlug: Record<string, string> = {};

async function getDataBySlug(slug: string): Promise<string | undefined | null> {
  try {
    const res = await fetch(`https://race2pick.race2pick.workers.dev/${slug}`);
    const data = await res.json();

    return data?.data;
  } catch {
    return undefined;
  }
}

async function getSlug(data: string): Promise<string | undefined | null> {
  try {
    const res = await fetch("https://race2pick.race2pick.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    const rasponseJson = await res.json();

    if (rasponseJson?.slug) {
      return rasponseJson?.slug;
    }

    return undefined;
  } catch {
    return undefined;
  }
}

export function useSlug() {
  const [isLoading, setIsLoading] = useState(false);

  function fetchData(data: string) {
    if (cache[data]) {
      return cache[data];
    }
    setIsLoading(true);

    return getSlug(data)
      .then((result) => {
        if (result) {
          cache[data] = result;
          setIsLoading(false);
          return result;
        }
        setIsLoading(false);
        return undefined;
      })
      .catch(() => {
        setIsLoading(false);
        return undefined;
      });
  }

  return { fetchData, isLoading };
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
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug, enabled]);

  return { data, isLoading };
}
