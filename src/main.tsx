import { createRoot } from "react-dom/client";
import App from "./App";
import { StoreProvider } from "./store";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StoreProvider>
    <App />
  </StoreProvider>,
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* التسجيل اختياري — التطبيق يعمل بدونه أيضاً */
    });
  });
}
