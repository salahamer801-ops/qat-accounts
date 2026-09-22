import { BarChart3, FileDown, FileSpreadsheet, Printer } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, DateInput, Field, GhostButton, PrimaryButton, SectionTitle } from "../components/ui";
import { useStore } from "../store";
import {
  computeFarmReport,
  exportExcel,
  formatDate,
  formatMoney,
  monthEnd,
  monthStart,
  prevMonthRange,
} from "../utils";

const ALL_START = "0000-01-01";
const ALL_END = "9999-12-31";

export default function Reports() {
  const { state } = useStore();
  const cur = state.settings.currency;
  const [start, setStart] = useState(monthStart());
  const [end, setEnd] = useState(monthEnd());

  const rows = useMemo(() => computeFarmReport(state, start, end), [state, start, end]);
  const totalIncome = rows.reduce((s, r) => s + r.income, 0);
  const totalExpenses = rows.reduce((s, r) => s + r.expenses, 0);
  const totalProfit = totalIncome - totalExpenses;

  const applyQuick = (s: string, e: string) => {
    setStart(s);
    setEnd(e);
  };

  return (
    <div className="space-y-4">
      <div className="hidden print:block" dir="rtl">
        <h1 style={{ textAlign: "center", margin: 0 }}>تقرير صافي ربح المزارع</h1>
        <p style={{ textAlign: "center", margin: "4px 0 16px" }}>
          الفترة من {formatDate(start)} إلى {formatDate(end)} · العملة: {cur}
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding={8}>
          <thead>
            <tr>
              {["المزرعة", "إجمالي الدخل", "إجمالي المصاريف", "صافي الربح", "عدد الربط"].map((h) => (
                <th key={h} style={{ border: "1px solid #999", background: "#eee", textAlign: "right" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.farmId}>
                <td style={{ border: "1px solid #999", fontWeight: 700 }}>{r.farmName}</td>
                <td style={{ border: "1px solid #999" }}>{formatMoney(r.income, cur)}</td>
                <td style={{ border: "1px solid #999" }}>{formatMoney(r.expenses, cur)}</td>
                <td style={{ border: "1px solid #999", fontWeight: 700 }}>
                  {formatMoney(r.profit, cur)}
                </td>
                <td style={{ border: "1px solid #999" }}>{r.bundles.toLocaleString("en-US")}</td>
              </tr>
            ))}
            <tr>
              <td style={{ border: "1px solid #999", fontWeight: 800 }}>الإجمالي</td>
              <td style={{ border: "1px solid #999", fontWeight: 800 }}>{formatMoney(totalIncome, cur)}</td>
              <td style={{ border: "1px solid #999", fontWeight: 800 }}>{formatMoney(totalExpenses, cur)}</td>
              <td style={{ border: "1px solid #999", fontWeight: 800 }}>{formatMoney(totalProfit, cur)}</td>
              <td style={{ border: "1px solid #999" }}></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="print:hidden space-y-4">
        <div className="flex items-center gap-3 pt-1">
          <span className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
            <BarChart3 size={22} />
          </span>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">التقارير وصافي الربح</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">الفرز حسب كل مزرعة</p>
          </div>
        </div>

        <Card className="p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            <GhostButton onClick={() => applyQuick(monthStart(), monthEnd())} className="py-2 px-3">
              هذا الشهر
            </GhostButton>
            <GhostButton
              onClick={() => {
                const r = prevMonthRange();
                applyQuick(r.start, r.end);
              }}
              className="py-2 px-3"
            >
              الشهر الماضي
            </GhostButton>
            <GhostButton onClick={() => applyQuick(ALL_START, ALL_END)} className="py-2 px-3">
              كل الفترات
            </GhostButton>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="من تاريخ">
              <DateInput value={start} onChange={(e) => setStart(e.target.value)} />
            </Field>
            <Field label="إلى تاريخ">
              <DateInput value={end} onChange={(e) => setEnd(e.target.value)} />
            </Field>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <div className="text-[11px] font-bold text-slate-400 mb-1">الدخل</div>
            <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              {formatMoney(totalIncome, cur)}
            </div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-[11px] font-bold text-slate-400 mb-1">المصاريف</div>
            <div className="text-sm font-black text-rose-600 dark:text-rose-400">
              {formatMoney(totalExpenses, cur)}
            </div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-[11px] font-bold text-slate-400 mb-1">صافي الربح</div>
            <div
              className={`text-sm font-black ${
                totalProfit >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {formatMoney(totalProfit, cur)}
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <SectionTitle>نتيجة كل مزرعة</SectionTitle>
          {rows.length === 0 ? (
            <Card className="p-6 text-center text-sm text-slate-400">لا توجد مزارع.</Card>
          ) : (
            rows.map((r) => (
              <Card key={r.farmId} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 dark:text-slate-100">
                    {r.farmName}
                  </span>
                  <span
                    className={`font-black ${
                      r.profit >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {formatMoney(r.profit, cur)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between bg-slate-50 dark:bg-slate-800/60 rounded-lg px-3 py-2">
                    <span className="text-slate-400">الدخل</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {formatMoney(r.income, cur)}
                    </span>
                  </div>
                  <div className="flex justify-between bg-slate-50 dark:bg-slate-800/60 rounded-lg px-3 py-2">
                    <span className="text-slate-400">المصاريف</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {formatMoney(r.expenses, cur)}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400">
                  عدد عمليات البيع: {r.salesCount} · إجمالي الربط: {r.bundles.toLocaleString("en-US")}
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <PrimaryButton onClick={() => exportExcel(state, start, end)} className="flex items-center justify-center gap-2">
            <FileSpreadsheet size={18} /> تصدير Excel
          </PrimaryButton>
          <button
            onClick={() => window.print()}
            className="rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 text-base flex items-center justify-center gap-2 shadow-sm active:scale-95 transition"
          >
            <Printer size={18} /> تصدير PDF
          </button>
        </div>
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <FileDown size={14} /> للتصدير PDF اختر "حفظ كـ PDF" من نافذة الطباعة.
        </p>
      </div>
    </div>
  );
}
