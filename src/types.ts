export type Tab = "home" | "accounts" | "sales" | "expenses" | "reports" | "settings" | "about";

export type CurrencyCode = "YER" | "SAR" | "USD";
export type TxType = "debt" | "expense" | "income";
export type QatType = "روس" | "مثنيات" | "نقفه" | "قطل";
export type PaymentType = "cash" | "credit";

export interface Farm {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  date: string; // yyyy-mm-dd
  type: TxType;
  amount: number;
  note: string;
}

export interface Sale {
  id: string;
  farmId: string;
  date: string; // yyyy-mm-dd
  qatType: QatType;
  count: number;
  unitPrice: number;
  details: string;
  paymentType: PaymentType;
  debtor: string;
}

export interface Expense {
  id: string;
  farmId: string;
  fromDate: string; // yyyy-mm-dd
  toDate: string; // yyyy-mm-dd
  diesel: number;
  water: number;
  powder: number;
  fertilizer: number;
  labor: number;
}

export interface Settings {
  currency: CurrencyCode;
  darkMode: boolean;
}

export interface AppState {
  farms: Farm[];
  transactions: Transaction[];
  sales: Sale[];
  expenses: Expense[];
  settings: Settings;
}
