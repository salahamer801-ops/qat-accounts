import { ArrowRight, Leaf, Settings } from "lucide-react";
import type { Tab } from "../types";

export default function Header({
  tab,
  onSettings,
}: {
  tab: Tab;
  onSettings: () => void;
}) {
  const isSubPage = tab === "settings" || tab === "about";
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-l from-emerald-700 to-emerald-600 text-white shadow print:hidden">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2 min-w-0">
          <Leaf className="shrink-0 text-emerald-200" size={20} />
          <h1 className="text-lg font-extrabold truncate">حسابات القات</h1>
        </div>
        <button
          onClick={onSettings}
          className="p-2 -mr-2 rounded-full hover:bg-white/10 active:bg-white/20 transition"
          aria-label={isSubPage ? "رجوع" : "الإعدادات"}
        >
          {isSubPage ? <ArrowRight size={22} /> : <Settings size={22} />}
        </button>
      </div>
    </header>
  );
}
