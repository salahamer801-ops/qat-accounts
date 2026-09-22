import type { AppState, CurrencyCode, Expense, TxType } from "./types";

export const QAT_TYPES = ["روس", "مثنيات", "نقفه", "قطل"] as const;

export const uid = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const todayISO = () => {
  const t = new Date();
  const local = new Date(t.getTime() - t.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

export const monthStart = (d: Date = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;

export const monthEnd = (d: Date = new Date()) => {
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(last).padStart(2, "0")}`;
};

export const prevMonthRange = () => {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return { start: monthStart(d), end: monthEnd(d) };
};

export const currencySymbol = (c: CurrencyCode): string =>
  ({ YER: "ر.ي", SAR: "ر.س", USD: "$" })[c];

export function formatMoney(n: number, currency: CurrencyCode): string {
  const rounded = Math.round(n || 0);
  const str = Math.abs(rounded).toLocaleString("en-US");
  return `${rounded < 0 ? "-" : ""}${str} ${currencySymbol(currency)}`;
}

const dateFmt = new Intl.DateTimeFormat("ar", {
  day: "numeric",
  month: "long",
  year: "numeric",
  numberingSystem: "latn",
});

const dateFmtShort = new Intl.DateTimeFormat("ar", {
  day: "numeric",
  month: "short",
  numberingSystem: "latn",
});

export const formatDate = (iso: string) =>
  iso ? dateFmt.format(new Date(iso + "T00:00:00")) : "";

export const formatDateShort = (iso: string) =>
  iso ? dateFmtShort.format(new Date(iso + "T00:00:00")) : "";

export const expenseTotal = (e: Expense) =>
  (e.diesel || 0) + (e.water || 0) + (e.powder || 0) + (e.fertilizer || 0) + (e.labor || 0);

export const overlaps = (from: string, to: string, start: string, end: string) =>
  from <= end && to >= start;

export const farmName = (state: AppState, id: string) =>
  state.farms.find((f) => f.id === id)?.name ?? "بدون مزرعة";

export interface FarmReportRow {
  farmId: string;
  farmName: string;
  income: number;
  expenses: number;
  profit: number;
  salesCount: number;
  bundles: number;
}

export function computeFarmReport(
  state: AppState,
  start: string,
  end: string,
): FarmReportRow[] {
  return state.farms.map((f) => {
    const sales = state.sales.filter(
      (s) => s.farmId === f.id && s.date >= start && s.date <= end,
    );
    const income = sales.reduce((sum, s) => sum + s.count * s.unitPrice, 0);
    const bundles = sales.reduce((sum, s) => sum + s.count, 0);
    const expenses = state.expenses
      .filter((e) => e.farmId === f.id && overlaps(e.fromDate, e.toDate, start, end))
      .reduce((sum, e) => sum + expenseTotal(e), 0);

    return {
      farmId: f.id,
      farmName: f.name,
      income,
      expenses,
      profit: income - expenses,
      salesCount: sales.length,
      bundles,
    };
  });
}

export function totalBalance(state: AppState): number {
  const genIncome = state.transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const genExpense = state.transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const salesIncome = state.sales.reduce((s, x) => s + x.count * x.unitPrice, 0);
  const farmExp = state.expenses.reduce((s, e) => s + expenseTotal(e), 0);
  return genIncome + salesIncome - genExpense - farmExp;
}

export function totalDebts(state: AppState): number {
  const debts = state.transactions
    .filter((t) => t.type === "debt")
    .reduce((s, t) => s + t.amount, 0);
  const creditSales = state.sales
    .filter((s) => (s.paymentType || "cash") === "credit")
    .reduce((s, x) => s + x.count * x.unitPrice, 0);
  return debts + creditSales;
}

const TX_LABEL: Record<TxType, string> = {
  income: "وارد",
  expense: "مصروف",
  debt: "دين",
};

export async function exportExcel(state: AppState, start?: string, end?: string) {
  const XLSX = await import("xlsx");
  const inPeriod = (iso: string) => !start || !end || (iso >= start && iso <= end);

  const farms = state.farms.map((f) => ({ "اسم المزرعة": f.name }));

  const sales = state.sales.filter((s) => inPeriod(s.date)).map((s) => ({
    "اسم المزرعة": farmName(state, s.farmId),
    "التاريخ": s.date,
    "نوع القات": s.qatType,
    "العدد": s.count,
    "قيمة الحبة": s.unitPrice,
    "المجموع": s.count * s.unitPrice,
    "طريقة الدفع": (s.paymentType || "cash") === "credit" ? "آجل" : "نقد",
    "اسم المدين": s.debtor || "",
    "تفاصيل البيع": s.details,
  }));

  const expenses = state.expenses
    .filter((e) => !start || !end || overlaps(e.fromDate, e.toDate, start, end))
    .map((e) => ({
      "اسم المزرعة": farmName(state, e.farmId),
      "من تاريخ": e.fromDate,
      "إلى تاريخ": e.toDate,
      "الديزل": e.diesel || 0,
      "الماء": e.water || 0,
      "البودرة": e.powder || 0,
      "الأسمدة": e.fertilizer || 0,
      "النفقة": e.labor || 0,
      "الإجمالي": expenseTotal(e),
    }));

  const transactions = state.transactions.filter((t) => inPeriod(t.date)).map((t) => ({
    "التاريخ": t.date,
    "النوع": TX_LABEL[t.type],
    "المبلغ": t.amount,
    "البيان": t.note,
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(farms.length ? farms : [{}]),
    "المزارع",
  );
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sales), "المبيعات");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(expenses), "مصروفات المزارع");
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(transactions),
    "الحسابات اليومية",
  );
  XLSX.writeFile(wb, `حسابات-القات-${todayISO()}.xlsx`);
}
