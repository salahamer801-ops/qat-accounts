import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type {
  AppState,
  Expense,
  Farm,
  Sale,
  Settings,
  Transaction,
} from "./types";
import { seedState } from "./mockData";
import { uid } from "./utils";

const KEY = "qat-accounts-state-v1";

type StoreValue = {
  state: AppState;
  addFarm: (name: string) => void;
  deleteFarm: (id: string) => void;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  addSale: (s: Omit<Sale, "id">) => void;
  deleteSale: (id: string) => void;
  addExpense: (e: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  updateSettings: (s: Partial<Settings>) => void;
  resetData: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (parsed && parsed.settings) {
        // ترحيل البيانات القديمة: إضافة حقلي الدفع والمدين للمبيعات السابقة
        return {
          ...parsed,
          sales: (parsed.sales || []).map((s) => ({
            ...s,
            paymentType: s.paymentType || "cash",
            debtor: s.debtor || "",
          })),
        };
      }
    }
  } catch {
    /* ignore corrupted storage */
  }
  return seedState();
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable */
    }
  }, [state]);

  const value = useMemo<StoreValue>(
    () => ({
      state,
      addFarm: (name) =>
        setState((s) => ({ ...s, farms: [...s.farms, { id: uid(), name }] })),
      deleteFarm: (id) =>
        setState((s) => ({
          ...s,
          farms: s.farms.filter((f) => f.id !== id),
          sales: s.sales.filter((x) => x.farmId !== id),
          expenses: s.expenses.filter((x) => x.farmId !== id),
        })),
      addTransaction: (t) =>
        setState((s) => ({
          ...s,
          transactions: [...s.transactions, { ...t, id: uid() }],
        })),
      deleteTransaction: (id) =>
        setState((s) => ({
          ...s,
          transactions: s.transactions.filter((t) => t.id !== id),
        })),
      addSale: (x) => setState((s) => ({ ...s, sales: [...s.sales, { ...x, id: uid() }] })),
      deleteSale: (id) =>
        setState((s) => ({ ...s, sales: s.sales.filter((x) => x.id !== id) })),
      addExpense: (e) =>
        setState((s) => ({ ...s, expenses: [...s.expenses, { ...e, id: uid() }] })),
      deleteExpense: (id) =>
        setState((s) => ({ ...s, expenses: s.expenses.filter((e) => e.id !== id) })),
      updateSettings: (upd) =>
        setState((s) => ({ ...s, settings: { ...s.settings, ...upd } })),
      resetData: () => setState(seedState()),
    }),
    [state],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export type { Farm };
