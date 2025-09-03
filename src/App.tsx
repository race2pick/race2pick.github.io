import { Suspense, lazy } from "react";
import { AppProvider } from "./context/app";
import { ToastProvider } from "./context/toast";
import Loading from "./components/ui/loading";

const Game = lazy(() => import("./game"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <ToastProvider>
        <AppProvider>
          <Game />
        </AppProvider>
      </ToastProvider>
    </Suspense>
  );
}

export default App;
