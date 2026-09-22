import type { AppState } from "./types";
import { monthEnd, monthStart, todayISO } from "./utils";

const d = (offsetDays: number) => {
  const t = new Date();
  t.setDate(t.getDate() - offsetDays);
  const local = new Date(t.getTime() - t.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

export function seedState(): AppState {
  const ms = monthStart();
  const me = monthEnd();
  const today = todayISO();

  return {
    settings: { currency: "YER", darkMode: false },
    farms: [
      { id: "f1", name: "مزرعة الوادي" },
      { id: "f2", name: "مزرعة الجبل" },
      { id: "f3", name: "مزرعة السهل" },
    ],
    sales: [
      { id: "s1", farmId: "f1", date: today, qatType: "روس", count: 40, unitPrice: 2500, details: "بيع جملة للتاجر أحمد", paymentType: "cash", debtor: "" },
      { id: "s2", farmId: "f1", date: today, qatType: "مثنيات", count: 25, unitPrice: 1800, details: "", paymentType: "cash", debtor: "" },
      { id: "s3", farmId: "f1", date: d(1), qatType: "نقفه", count: 60, unitPrice: 1200, details: "سوق الخميس", paymentType: "credit", debtor: "علي محمد" },
      { id: "s4", farmId: "f2", date: d(1), qatType: "قطل", count: 35, unitPrice: 2000, details: "تصدير إلى صنعاء", paymentType: "cash", debtor: "" },
      { id: "s5", farmId: "f2", date: d(2), qatType: "روس", count: 30, unitPrice: 2600, details: "", paymentType: "cash", debtor: "" },
      { id: "s6", farmId: "f2", date: d(3), qatType: "مثنيات", count: 20, unitPrice: 1700, details: "بيع محلي", paymentType: "credit", debtor: "أبو صالح" },
      { id: "s7", farmId: "f3", date: d(4), qatType: "نقفه", count: 50, unitPrice: 1100, details: "", paymentType: "cash", debtor: "" },
      { id: "s8", farmId: "f3", date: d(5), qatType: "قطل", count: 45, unitPrice: 1900, details: "", paymentType: "cash", debtor: "" },
      { id: "s9", farmId: "f3", date: d(6), qatType: "روس", count: 28, unitPrice: 2400, details: "عميل جملة", paymentType: "credit", debtor: "محسن النجار" },
    ],
    expenses: [
      { id: "e1", farmId: "f1", fromDate: ms, toDate: me, diesel: 30000, water: 15000, powder: 20000, fertilizer: 18000, labor: 40000 },
      { id: "e2", farmId: "f2", fromDate: ms, toDate: me, diesel: 25000, water: 12000, powder: 16000, fertilizer: 14000, labor: 35000 },
      { id: "e3", farmId: "f3", fromDate: ms, toDate: me, diesel: 22000, water: 10000, powder: 14000, fertilizer: 12000, labor: 30000 },
    ],
    transactions: [
      { id: "t1", date: today, type: "income", amount: 50000, note: "وارد بيع قات إضافي" },
      { id: "t2", date: d(2), type: "expense", amount: 15000, note: "مصروف وقود سيارة" },
      { id: "t3", date: d(3), type: "debt", amount: 80000, note: "دين على التاجر صالح" },
      { id: "t4", date: d(5), type: "income", amount: 20000, note: "إيجار محل" },
      { id: "t5", date: d(7), type: "expense", amount: 6000, note: "مصاريف نثرية" },
    ],
  };
}
