import { Settings, Tractor, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge, Card, DateInput, Field, NumInput, PrimaryButton, SectionTitle, SelectInput } from "../components/ui";
import { useStore } from "../store";
import { expenseTotal, farmName, formatDateShort, formatMoney, monthEnd, monthStart } from "../utils";

const emptyForm = {
  farmId: "",
  fromDate: monthStart(),
  toDate: monthEnd(),
  diesel: "",
  water: "",
  powder: "",
  fertilizer: "",
  labor: "",
};

export default function Expenses({ goToSettings }: { goToSettings: () => void }) {
  const { state, addExpense, deleteExpense } = useStore();
  const cur = state.settings.currency;
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const amounts = {
    diesel: parseFloat(form.diesel) || 0,
    water: parseFloat(form.water) || 0,
    powder: parseFloat(form.powder) || 0,
    fertilizer: parseFloat(form.fertilizer) || 0,
    labor: parseFloat(form.labor) || 0,
  };
  const total = Object.values(amounts).reduce((s, n) => s + n, 0);

  const list = useMemo(
    () => [...state.expenses].sort((a, b) => (a.fromDate < b.fromDate ? 1 : -1)),
    [state.expenses],
  );

  const submit = () => {
    if (!form.farmId) return setError("اختر اسم المزرعة");
    if (!(total > 0)) return setError("أدخل مبلغاً واحداً على الأقل في المصروفات");
    if (form.fromDate > form.toDate) return setError("تاريخ البداية يجب أن يكون قبل تاريخ النهاية");

    addExpense({
      farmId: form.farmId,
      fromDate: form.fromDate,
      toDate: form.toDate,
      ...amounts,
    });
    setForm({ ...emptyForm, farmId: form.farmId });
    setError("");
  };

  return (
    <div className="space-y-5">
      <div className="pt-1">
        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">مصروفات المزرعة</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">تكاليف التشغيل والنفقة</p>
      </div>

      {state.farms.length === 0 ? (
        <Card className="p-6 text-center space-y-3">
          <Tractor className="mx-auto text-slate-300" size={32} />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            أضف مزرعة أولاً لتسجيل مصروفاتها.
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

          <div className="grid grid-cols-2 gap-3">
            <Field label="من تاريخ">
              <DateInput
                value={form.fromDate}
                onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
              />
            </Field>
            <Field label="إلى تاريخ">
              <DateInput
                value={form.toDate}
                onChange={(e) => setForm({ ...form, toDate: e.target.value })}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="مصاريف الديزل">
              <NumInput
                placeholder="0"
                value={form.diesel}
                onChange={(e) => setForm({ ...form, diesel: e.target.value })}
              />
            </Field>
            <Field label="قيمة الماء">
              <NumInput
                placeholder="0"
                value={form.water}
                onChange={(e) => setForm({ ...form, water: e.target.value })}
              />
            </Field>
            <Field label="البودرة (مبيدات)">
              <NumInput
                placeholder="0"
                value={form.powder}
                onChange={(e) => setForm({ ...form, powder: e.target.value })}
              />
            </Field>
            <Field label="الأسمدة">
              <NumInput
                placeholder="0"
                value={form.fertilizer}
                onChange={(e) => setForm({ ...form, fertilizer: e.target.value })}
              />
            </Field>
          </div>

          <Field
            label="النفقة"
            hint="نفقات العمال اليومية، الأكل والشرب للعمال، أو أي نفقات نثرية"
          >
            <NumInput
              placeholder="0"
              value={form.labor}
              onChange={(e) => setForm({ ...form, labor: e.target.value })}
            />
          </Field>

          <div className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3 flex items-center justify-between">
            <span className="font-bold text-slate-600 dark:text-slate-300">إجمالي المصروفات</span>
            <span className="font-black text-lg text-slate-900 dark:text-slate-100">
              {formatMoney(total, cur)}
            </span>
          </div>

          {error && <p className="text-sm font-bold text-rose-500">{error}</p>}

          <PrimaryButton onClick={submit}>حفظ المصروفات</PrimaryButton>
        </Card>
      )}

      {list.length > 0 && (
        <div className="space-y-3">
          <SectionTitle>المصروفات المسجلة</SectionTitle>
          <div className="space-y-2.5">
            {list.map((e) => (
              <Card key={e.id} className="p-3.5 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-slate-800 dark:text-slate-100 truncate">
                      {farmName(state, e.farmId)}
                    </div>
                    <div className="text-xs text-slate-400">
                      {formatDateShort(e.fromDate)} — {formatDateShort(e.toDate)}
                    </div>
                  </div>
                  <div className="text-left shrink-0 flex items-center gap-2">
                    <div className="font-black text-base text-rose-600 dark:text-rose-400">
                      {formatMoney(expenseTotal(e), cur)}
                    </div>
                    <button
                      onClick={() => deleteExpense(e.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-500 transition"
                      aria-label="حذف"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {e.diesel > 0 && <Badge>ديزل {formatMoney(e.diesel, cur)}</Badge>}
                  {e.water > 0 && <Badge>ماء {formatMoney(e.water, cur)}</Badge>}
                  {e.powder > 0 && <Badge>بودرة {formatMoney(e.powder, cur)}</Badge>}
                  {e.fertilizer > 0 && <Badge>أسمدة {formatMoney(e.fertilizer, cur)}</Badge>}
                  {e.labor > 0 && <Badge tone="amber">نفقة {formatMoney(e.labor, cur)}</Badge>}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
