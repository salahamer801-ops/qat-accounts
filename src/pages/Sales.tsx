import { Settings, ShoppingBag, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Card, DateInput, Field, NumInput, PrimaryButton, SectionTitle, SelectInput, TextAreaInput, TextInput } from "../components/ui";
import { useStore } from "../store";
import type { PaymentType, QatType } from "../types";
import { QAT_TYPES, farmName, formatDateShort, formatMoney, todayISO } from "../utils";

const emptyForm = {
  farmId: "",
  date: todayISO(),
  qatType: "" as QatType | "",
  count: "",
  unitPrice: "",
  details: "",
  paymentType: "cash" as PaymentType,
  debtor: "",
};

export default function Sales({ goToSettings }: { goToSettings: () => void }) {
  const { state, addSale, deleteSale } = useStore();
  const cur = state.settings.currency;
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const count = parseFloat(form.count) || 0;
  const unitPrice = parseFloat(form.unitPrice) || 0;
  const total = count * unitPrice;

  const summary = useMemo(() => {
    return state.farms
      .map((farm) => {
        const sales = state.sales.filter((s) => s.farmId === farm.id);
        const byType = QAT_TYPES.map((qt) => {
          const items = sales.filter((s) => s.qatType === qt);
          const qty = items.reduce((sum, s) => sum + s.count, 0);
          const amount = items.reduce((sum, s) => sum + s.count * s.unitPrice, 0);
          return { qt, qty, amount };
        }).filter((x) => x.qty > 0);
        const totalQty = byType.reduce((s, x) => s + x.qty, 0);
        const totalAmount = byType.reduce((s, x) => s + x.amount, 0);
        return { farm, byType, totalQty, totalAmount };
      })
      .filter((f) => f.totalQty > 0);
  }, [state.farms, state.sales]);

  const recent = useMemo(
    () => [...state.sales].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 12),
    [state.sales],
  );

  const submit = () => {
    if (!form.farmId) return setError("اختر اسم المزرعة");
    if (!form.qatType) return setError("اختر نوع القات");
    if (!(count > 0)) return setError("أدخل العدد بشكل صحيح");
    if (!(unitPrice > 0)) return setError("أدخل قيمة الحبة بشكل صحيح");
    if (form.paymentType === "credit" && !form.debtor.trim())
      return setError("اكتب اسم المدين للبيع الآجل");

    addSale({
      farmId: form.farmId,
      date: form.date,
      qatType: form.qatType as QatType,
      count,
      unitPrice,
      details: form.details.trim(),
      paymentType: form.paymentType,
      debtor: form.paymentType === "credit" ? form.debtor.trim() : "",
    });
    setForm({ ...emptyForm, farmId: form.farmId });
    setError("");
  };

  return (
    <div className="space-y-5">
      <div className="pt-1">
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">مبيعات القات</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">تسجيل دخل مبيعات القات</p>
      </div>

      {state.farms.length === 0 ? (
        <Card className="p-6 text-center space-y-3">
          <ShoppingBag className="mx-auto text-slate-300" size={32} />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            أضف مزرعة أولاً لتسجيل مبيعات القات.
          </p>
          <button
            onClick={goToSettings}
            className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm"
          >
            <Settings size={16} /> الذهاب إلى الإعدادات
          </button>
        </Card>
      ) : (
        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="اسم المزرعة">
              <SelectInput
                value={form.farmId}
                onChange={(e) => setForm({ ...form, farmId: e.target.value })}
              >
                <option value="">— اختر —</option>
                {state.farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="التاريخ واليوم">
              <DateInput
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="نوع القات *">
              <SelectInput
                value={form.qatType}
                onChange={(e) => setForm({ ...form, qatType: e.target.value as QatType })}
              >
                <option value="">— اختر —</option>
                {QAT_TYPES.map((qt) => (
                  <option key={qt} value={qt}>
                    {qt}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="العدد (الربط)">
              <NumInput
                placeholder="0"
                value={form.count}
                onChange={(e) => setForm({ ...form, count: e.target.value })}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="قيمة الحبة">
              <NumInput
                placeholder="0"
                value={form.unitPrice}
                onChange={(e) => setForm({ ...form, unitPrice: e.target.value })}
              />
            </Field>
            <Field label="المجموع">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-3 text-base font-black text-emerald-700 dark:text-emerald-300">
                {formatMoney(total, cur)}
              </div>
            </Field>
          </div>

          <Field label="طريقة الدفع">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, paymentType: "cash" })}
                className={`rounded-xl py-3 font-bold text-base border transition ${
                  form.paymentType === "cash"
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                نقد
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, paymentType: "credit" })}
                className={`rounded-xl py-3 font-bold text-base border transition ${
                  form.paymentType === "credit"
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                }`}
              >
                آجل
              </button>
            </div>
          </Field>

          {form.paymentType === "credit" && (
            <Field label="اسم المدين">
              <TextInput
                placeholder="اكتب اسم المدين"
                value={form.debtor}
                onChange={(e) => setForm({ ...form, debtor: e.target.value })}
              />
            </Field>
          )}

          <Field label="تفاصيل البيع (اختياري)">
            <TextAreaInput
              placeholder="مثال: اسم المشتري، مكان البيع، حالة السوق…"
              value={form.details}
              onChange={(e) => setForm({ ...form, details: e.target.value })}
            />
          </Field>

          {error && <p className="text-sm font-bold text-rose-500">{error}</p>}

          <PrimaryButton onClick={submit}>إضافة البيع</PrimaryButton>
        </Card>
      )}

      <div className="space-y-3">
        <SectionTitle>ملخص التجميع حسب النوع والمزرعة</SectionTitle>
        {summary.length === 0 ? (
          <Card className="p-6 text-center text-sm text-slate-400">لا توجد مبيعات مسجلة بعد.</Card>
        ) : (
          summary.map(({ farm, byType, totalQty, totalAmount }) => (
            <Card key={farm.id} className="overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 dark:bg-emerald-900/30 border-b border-emerald-100 dark:border-emerald-900">
                <span className="font-extrabold text-slate-800 dark:text-slate-100">{farm.name}</span>
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  الإجمالي: {formatMoney(totalAmount, cur)}
                </span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-400 text-xs border-b border-slate-100 dark:border-slate-800">
                    <th className="text-right font-bold px-4 py-2">النوع</th>
                    <th className="text-center font-bold px-2 py-2">العدد</th>
                    <th className="text-left font-bold px-4 py-2">المبلغ</th>
                  </tr>
                </thead>
                <tbody>
                  {byType.map((x) => (
                    <tr key={x.qt} className="border-b border-slate-50 dark:border-slate-800/60">
                      <td className="px-4 py-2.5 font-bold text-slate-700 dark:text-slate-200">{x.qt}</td>
                      <td className="px-2 py-2.5 text-center text-slate-500 dark:text-slate-400">{x.qty.toLocaleString("en-US")}</td>
                      <td className="px-4 py-2.5 text-left font-bold text-slate-700 dark:text-slate-200">
                        {formatMoney(x.amount, cur)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 dark:bg-slate-800/40">
                    <td className="px-4 py-2.5 font-black text-slate-800 dark:text-slate-100">الإجمالي</td>
                    <td className="px-2 py-2.5 text-center font-black text-slate-800 dark:text-slate-100">
                      {totalQty.toLocaleString("en-US")}
                    </td>
                    <td className="px-4 py-2.5 text-left font-black text-slate-800 dark:text-slate-100">
                      {formatMoney(totalAmount, cur)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          ))
        )}
      </div>

      {recent.length > 0 && (
        <div className="space-y-3">
          <SectionTitle>آخر المبيعات</SectionTitle>
          <div className="space-y-2.5">
            {recent.map((s) => (
              <Card key={s.id} className="p-3.5 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge tone="teal">{s.qatType}</Badge>
                    {(s.paymentType || "cash") === "credit" ? (
                      <Badge tone="amber">آجل</Badge>
                    ) : (
                      <Badge tone="slate">نقد</Badge>
                    )}
                    <span className="text-xs text-slate-400">{formatDateShort(s.date)}</span>
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                    {farmName(state, s.farmId)} · {s.count} × {s.unitPrice.toLocaleString("en-US")}
                    {(s.paymentType || "cash") === "credit" && s.debtor ? ` · على ${s.debtor}` : ""}
                    {s.details ? ` · ${s.details}` : ""}
                  </div>
                </div>
                <div className="text-left shrink-0 flex items-center gap-2">
                  <div className="font-black text-base text-emerald-600 dark:text-emerald-400">
                    {formatMoney(s.count * s.unitPrice, cur)}
                  </div>
                  <button
                    onClick={() => deleteSale(s.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 transition"
                    aria-label="حذف"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
