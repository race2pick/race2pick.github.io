import Loading from "@/components/ui/loading";
import { useApp } from "@/context/app";
import { useSlugData } from "@/lib/networks";
import { useEffect, useState } from "react";

export default function Preparing() {
  const [slug, setSlug] = useState<string>();
  const [doneCheckSlug, setDoneCheckSlug] = useState(false);
  const [doneSetData, setDoneSetData] = useState(false);

  const { getSlugSearchParams, setIsReady, setDataSearchParams } = useApp();

  const { data, isLoading } = useSlugData(slug || "", !!slug);

  useEffect(() => {
    if (doneCheckSlug) {
      return;
    }

    const slugParams = getSlugSearchParams();

    if (slugParams) {
      setSlug(slugParams);
    } else {
      setDoneSetData(true);
      setIsReady(true);
    }

    setDoneCheckSlug(true);
  }, [doneCheckSlug, getSlugSearchParams, setIsReady]);

  useEffect(() => {
    if (data) {
      setDataSearchParams(data);
      setDoneSetData(true);
      return;
    }

    if (!data && !isLoading) {
      setDoneSetData(true);
    }
  }, [data, setDataSearchParams, isLoading]);

  useEffect(() => {
    if (doneCheckSlug && !isLoading && doneSetData) {
      setIsReady(true);
    }
  }, [doneCheckSlug, isLoading, doneSetData, setIsReady]);

  return <Loading />;
}
