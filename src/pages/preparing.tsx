import Loading from "@/components/ui/loading";
import { useApp } from "@/context/app";
import { useSlugData } from "@/lib/networks";
import { useEffect, useState } from "react";

export default function Preparing() {
  const [slug, setSlug] = useState<string>();
  const [doneCheckSlug, setDoneCheckSlug] = useState(false);
  const [doneSetData, setDoneSetData] = useState(false);

  const {
    getSlugSearchParams,
    setIsReady,
    setDataSearchParams,
    clearSearchParams,
  } = useApp();

  const { data, isLoading } = useSlugData(slug || "", !!slug && doneCheckSlug);

  useEffect(() => {
    if (doneCheckSlug) {
      return;
    }
    const slugParams = getSlugSearchParams();

    if (slugParams) {
      setSlug(slugParams);
    } else {
      clearSearchParams();
      setDoneSetData(true);
    }
    setDoneCheckSlug(true);
  }, [clearSearchParams, doneCheckSlug, getSlugSearchParams]);

  useEffect(() => {
    if (data) {
      setDataSearchParams(data);
      setDoneSetData(true);
      return;
    }

    if (!data && doneCheckSlug && !isLoading) {
      clearSearchParams();
      setDoneSetData(true);
    }
  }, [data, setDataSearchParams, doneCheckSlug, clearSearchParams, isLoading]);

  useEffect(() => {
    if (doneSetData) {
      setIsReady(true);
    }
  }, [doneSetData, setIsReady]);

  return <Loading />;
}
