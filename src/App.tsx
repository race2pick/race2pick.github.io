import { AppProvider } from "./context/app";
import { ToastProvider } from "./context/toast";
import Game from "./game";

function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <Game />
      </AppProvider>
    </ToastProvider>
  );
}

export default App;
