import { Suspense } from "react";
import { AppProvider } from "./context/app";
import { ToastProvider } from "./context/toast";
import Loading from "./components/ui/loading";
import Page from "./pages";

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <ToastProvider>
        <AppProvider>
          <Page />
        </AppProvider>
      </ToastProvider>
    </Suspense>
  );
}

export default App;
