import { useEffect, useState } from "react";
import BottomNav from "./components/BottomNav";
import Header from "./components/Header";
import About from "./pages/About";
import Accounts from "./pages/Accounts";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Sales from "./pages/Sales";
import Settings from "./pages/Settings";
import { StoreProvider, useStore } from "./store";
import type { Tab } from "./types";

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}

function Shell() {
  const { state } = useStore();
  const [tab, setTab] = useState<Tab>("home");
  const [autoAdd, setAutoAdd] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.settings.darkMode);
  }, [state.settings.darkMode]);

  const go = (t: Tab) => {
    setTab(t);
    setAutoAdd(false);
    window.scrollTo({ top: 0 });
  };

  const quick = (t: Tab) => {
    if (t === "accounts") {
      setAutoAdd(true);
      setTab("accounts");
    } else {
      setAutoAdd(false);
      setTab(t);
    }
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen bg-[#f2f6f3] dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <div className="mx-auto max-w-md min-h-screen flex flex-col relative">
        <Header
          tab={tab}
          onSettings={() => go(tab === "settings" || tab === "about" ? "home" : "settings")}
        />
        <main className="flex-1 px-4 pb-32 pt-3">
          {tab === "home" && <Dashboard onQuick={quick} />}
          {tab === "accounts" && <Accounts autoAdd={autoAdd} onConsumed={() => setAutoAdd(false)} />}
          {tab === "sales" && <Sales goToSettings={() => go("settings")} />}
          {tab === "expenses" && <Expenses goToSettings={() => go("settings")} />}
          {tab === "reports" && <Reports />}
          {tab === "settings" && (
            <Settings goToReports={() => go("reports")} goToAbout={() => go("about")} />
          )}
          {tab === "about" && <About onBack={() => go("settings")} />}
        </main>
        <BottomNav tab={tab} onSelect={go} />
      </div>
    </div>
  );
}
