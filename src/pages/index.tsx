import Loading from "@/components/ui/loading";
import { useApp } from "@/context/app";
import { Suspense, lazy } from "react";

const Preparing = lazy(() => import("./preparing"));
const Game = lazy(() => import("../game"));

export default function Page() {
  const { isReady } = useApp();
  return (
    <Suspense fallback={<Loading />}>
      {isReady ? <Game /> : <Preparing />}
    </Suspense>
  );
}
