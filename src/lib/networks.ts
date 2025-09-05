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

async function getSlug(data: string) {
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

export function useSlug(data: string) {
  const [slug, setSlug] = useState<string | null>(cache[data] ?? null);
  const [isLoading, setIsLoading] = useState(!cache[data]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!data || isError) return;

    let mounted = true;

    if (cache[data]) {
      setSlug(cache[data]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getSlug(data).then((result) => {
      if (!mounted) return;

      if (!result) {
        setIsError(true);
        setIsLoading(false);
        return;
      }

      cache[data] = result;
      setSlug(result);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [data, isLoading, isError]);

  return { slug, isLoading };
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
