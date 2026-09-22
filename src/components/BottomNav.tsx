import { BarChart3, Home, ReceiptText, ShoppingBag, Tractor } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Tab } from "../types";

const items: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "الرئيسية", icon: Home },
  { id: "accounts", label: "الحسابات", icon: ReceiptText },
  { id: "sales", label: "المبيعات", icon: ShoppingBag },
  { id: "expenses", label: "المصروفات", icon: Tractor },
  { id: "reports", label: "التقارير", icon: BarChart3 },
];

export default function BottomNav({
  tab,
  onSelect,
}: {
  tab: Tab;
  onSelect: (t: Tab) => void;
}) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 print:hidden">
      <div className="mx-auto max-w-md bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5">
          {items.map((item) => {
            const active = tab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className="flex flex-col items-center gap-0.5 py-2 transition"
                aria-label={item.label}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.5 : 2}
                  className={active ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}
                />
                <span
                  className={`text-[11px] font-bold ${
                    active
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
