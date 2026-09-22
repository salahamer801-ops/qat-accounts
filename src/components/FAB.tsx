import { Plus, ReceiptText, ShoppingBag, Tractor } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import type { Tab } from "../types";

const options: { label: string; tab: Tab; icon: LucideIcon; color: string }[] = [
  { label: "عملية جديدة", tab: "accounts", icon: ReceiptText, color: "bg-emerald-600" },
  { label: "بيع قات", tab: "sales", icon: ShoppingBag, color: "bg-teal-600" },
  { label: "مصروف مزرعة", tab: "expenses", icon: Tractor, color: "bg-amber-600" },
];

export default function FAB({ onQuick }: { onQuick: (t: Tab) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 print:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 flex flex-col-reverse items-center gap-3 print:hidden">
        {open &&
          options.map((o) => {
            const Icon = o.icon;
            return (
              <button
                key={o.tab}
                onClick={() => {
                  setOpen(false);
                  onQuick(o.tab);
                }}
                className="flex items-center gap-2 bg-white dark:bg-slate-800 shadow-lg rounded-full pl-4 pr-2 py-1.5 font-bold text-slate-700 dark:text-slate-100 text-sm active:scale-95 transition"
              >
                <span
                  className={`w-8 h-8 rounded-full ${o.color} text-white flex items-center justify-center shrink-0`}
                >
                  <Icon size={16} />
                </span>
                {o.label}
              </button>
            );
          })}
        <button
          onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center active:scale-95 transition"
          aria-label="إضافة سريعة"
        >
          <Plus size={28} className={`transition-transform ${open ? "rotate-45" : ""}`} />
        </button>
      </div>
    </>
  );
}
