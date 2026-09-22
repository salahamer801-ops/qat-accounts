import { ChevronLeft, Coins, FileSpreadsheet, Info, Moon, Plus, Printer, Smartphone, Sprout, Sun, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card, Field, SectionTitle, SelectInput, TextInput } from "../components/ui";
import { useStore } from "../store";
import type { CurrencyCode } from "../types";
import { currencySymbol, exportExcel } from "../utils";

export default function Settings({ goToReports, goToAbout }: { goToReports: () => void; goToAbout: () => void }) {
  const { state, addFarm, deleteFarm, updateSettings, resetData } = useStore();
  const [farmNameInput, setFarmNameInput] = useState("");
  const isNative =
    typeof window !== "undefined" &&
    Boolean((window as any).Capacitor?.isNativePlatform?.());

  const addFarmHandler = () => {
    const name = farmNameInput.trim();
    if (!name) return;
    addFarm(name);
    setFarmNameInput("");
  };

  const dark = state.settings.darkMode;

  return (
    <div className="space-y-5">
      <div className="pt-1">
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">الإعدادات</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">المزارع والعملة والمظهر</p>
      </div>

      <div className="space-y-3">
        <SectionTitle className="flex items-center gap-2">
          <Sprout size={18} className="text-emerald-600" /> إعداد المزارع
        </SectionTitle>
        <Card className="p-4 space-y-3">
          <div className="flex gap-2">
            <TextInput
              placeholder="اسم المزرعة الجديدة"
              value={farmNameInput}
              onChange={(e) => setFarmNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addFarmHandler()}
            />
            <button
              onClick={addFarmHandler}
              className="shrink-0 w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center active:scale-95 transition"
              aria-label="إضافة مزرعة"
            >
              <Plus size={22} />
            </button>
          </div>
          {state.farms.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-2">
              لا توجد مزارع. أضف أول مزرعة.
            </p>
          ) : (
            <ul className="space-y-2">
              {state.farms.map((f) => (
                <li
                  key={f.id}
                  className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 rounded-xl px-3 py-2.5"
                >
                  <span className="font-bold text-slate-700 dark:text-slate-200">{f.name}</span>
                  <button
                    onClick={() => deleteFarm(f.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition"
                    aria-label={`حذف ${f.name}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-slate-400">
            ملاحظة: حذف المزرعة يحذف مبيعاتها ومصروفاتها المرتبطة بها.
          </p>
        </Card>
      </div>

      <div className="space-y-3">
        <SectionTitle className="flex items-center gap-2">
          <Coins size={18} className="text-emerald-600" /> إعداد العملة
        </SectionTitle>
        <Card className="p-4">
          <Field label="العملة الافتراضية">
            <SelectInput
              value={state.settings.currency}
              onChange={(e) => updateSettings({ currency: e.target.value as CurrencyCode })}
            >
              <option value="YER">الريال اليمني (YER)</option>
              <option value="SAR">الريال السعودي (SAR)</option>
              <option value="USD">الدولار الأمريكي (USD)</option>
            </SelectInput>
          </Field>
          <p className="text-xs text-slate-400 mt-2">
            الرمز المستخدم: {currencySymbol(state.settings.currency)}
          </p>
        </Card>
      </div>

      <div className="space-y-3">
        <SectionTitle className="flex items-center gap-2">
          <Moon size={18} className="text-emerald-600" /> المظهر
        </SectionTitle>
        <Card className="p-4">
          <button
            onClick={() => updateSettings({ darkMode: !dark })}
            className="w-full flex items-center justify-between"
            aria-label="تبديل الوضع الليلي"
          >
            <span className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
              {dark ? <Moon size={18} className="text-emerald-500" /> : <Sun size={18} className="text-amber-500" />}
              {dark ? "الوضع الليلي مفعّل" : "الوضع النهاري مفعّل"}
            </span>
            <span
              className={`relative inline-flex w-12 h-7 rounded-full transition-colors ${
                dark ? "bg-emerald-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${
                  dark ? "right-6" : "right-1"
                }`}
              />
            </span>
          </button>
        </Card>
      </div>

      <div className="space-y-3">
        <SectionTitle>تصدير البيانات</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => exportExcel(state)}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition"
          >
            <FileSpreadsheet size={18} /> تصدير Excel
          </button>
          <button
            onClick={goToReports}
            className="rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition"
          >
            <Printer size={18} /> تقرير PDF
          </button>
        </div>
        <p className="text-xs text-slate-400">
          تصدير Excel يشمل كل البيانات. تقرير PDF من صفحة التقارير.
        </p>
      </div>

      <div className="space-y-3">
        <SectionTitle>حول التطبيق</SectionTitle>
        <Card className="p-4">
          <button
            onClick={goToAbout}
            className="w-full flex items-center justify-between"
            aria-label="حول التطبيق"
          >
            <span className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
              <Info size={18} className="text-emerald-600" />
              معلومات التطبيق وشروط الاستخدام
            </span>
            <ChevronLeft size={18} className="text-slate-300" />
          </button>
        </Card>
      </div>

      {!isNative && (
        <div className="space-y-3">
          <SectionTitle>تطبيق الأندرويد</SectionTitle>
          <Card className="p-4 space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              حمّل التطبيق كملف APK لتثبيته على هاتفك الأندرويد ويعمل بدون إنترنت.
            </p>
            <a
              href="/Qat-Accounts.apk"
              download="Qat-Accounts.apk"
              target="_blank"
              rel="noopener"
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 text-base flex items-center justify-center gap-2 shadow-sm active:scale-95 transition"
            >
              <Smartphone size={20} /> تحميل تطبيق أندرويد (APK)
            </a>
          </Card>
        </div>
      )}

      <Card className="p-4">
        <button
          onClick={() => {
            if (confirm("سيتم مسح جميع البيانات والعودة للبيانات التجريبية. هل أنت متأكد؟")) {
              resetData();
            }
          }}
          className="w-full text-rose-600 font-bold text-sm py-2"
        >
          إعادة تعيين البيانات
        </button>
      </Card>
    </div>
  );
}
