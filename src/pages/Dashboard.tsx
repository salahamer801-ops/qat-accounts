import { HandCoins, Sprout, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FAB from "../components/FAB";
import { Card, SectionTitle } from "../components/ui";
import { useStore } from "../store";
import type { Tab } from "../types";
import {
  computeFarmReport,
  formatDate,
  formatMoney,
  monthEnd,
  monthStart,
  todayISO,
  totalBalance,
  totalDebts,
  type FarmReportRow,
} from "../utils";

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: "amber" | "emerald" | "rose";
}) {
  const tones = {
    amber: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300",
    emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300",
    rose: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300",
  } as const;
  return (
    <Card className="p-3 flex flex-col gap-2">
      <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${tones[tone]}`}>
        <Icon size={18} />
      </span>
      <div>
        <div className="text-[11px] font-bold text-slate-400 mb-0.5">{label}</div>
        <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
          {value}
        </div>
      </div>
    </Card>
  );
}

function FarmProfitCard({
  row,
  currency,
}: {
  row: FarmReportRow;
  currency: Parameters<typeof formatMoney>[1];
}) {
  const positive = row.profit >= 0;
  return (
    <Card className="p-4 flex items-center gap-3">
      <span className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
        <Sprout size={22} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-extrabold text-slate-800 dark:text-slate-100 truncate">
          {row.farmName}
        </div>
        <div className="text-xs text-slate-400">
          مبيعات {formatMoney(row.income, currency)} · مصاريف{" "}
          {formatMoney(row.expenses, currency)}
        </div>
      </div>
      <div className="text-left shrink-0">
        <div
          className={`font-black text-base ${
            positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          }`}
        >
          {formatMoney(row.profit, currency)}
        </div>
        <div className="text-[11px] text-slate-400">صافي الربح</div>
      </div>
    </Card>
  );
}

export default function Dashboard({ onQuick }: { onQuick: (t: Tab) => void }) {
  const { state } = useStore();
  const cur = state.settings.currency;
  const balance = totalBalance(state);
  const debts = totalDebts(state);
  const report = computeFarmReport(state, monthStart(), monthEnd());
  const monthSales = report.reduce((s, r) => s + r.income, 0);
  const monthExpenses = report.reduce((s, r) => s + r.expenses, 0);

  return (
    <div className="space-y-4">
      <div className="pt-1">
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">لوحة التحكم</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{formatDate(todayISO())}</p>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-5 shadow-lg">
        <div className="absolute -left-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -right-6 -bottom-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="relative">
          <div className="flex items-center gap-2 text-emerald-100">
            <Wallet size={18} />
            <span className="text-sm font-bold">إجمالي الرصيد الحالي</span>
          </div>
          <div className="text-4xl font-black mt-2 leading-tight break-words">
            {formatMoney(balance, cur)}
          </div>
          <p className="text-emerald-100/80 text-xs mt-2">الوارد والمبيعات − المصروفات</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="الديون" value={formatMoney(debts, cur)} icon={HandCoins} tone="amber" />
        <StatCard label="مبيعات الشهر" value={formatMoney(monthSales, cur)} icon={TrendingUp} tone="emerald" />
        <StatCard label="مصاريف الشهر" value={formatMoney(monthExpenses, cur)} icon={TrendingDown} tone="rose" />
      </div>

      <div className="space-y-3">
        <SectionTitle>صافي ربح المزارع — الشهر الحالي</SectionTitle>
        {report.length === 0 ? (
          <Card className="p-6 text-center text-sm text-slate-400">
            لا توجد مزارع بعد. أضف مزرعة من الإعدادات للبدء.
          </Card>
        ) : (
          report.map((r) => <FarmProfitCard key={r.farmId} row={r} currency={cur} />)
        )}
      </div>

      <FAB onQuick={onQuick} />
    </div>
  );
}
