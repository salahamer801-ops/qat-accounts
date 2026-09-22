import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Modal from "../components/Modal";
import { Badge, Card, DateInput, Field, NumInput, PrimaryButton, SelectInput, TextInput } from "../components/ui";
import { useStore } from "../store";
import type { TxType } from "../types";
import { formatDateShort, formatMoney, todayISO } from "../utils";

const TYPE_META: Record<TxType, { label: string; tone: "emerald" | "rose" | "amber" }> = {
  income: { label: "وارد", tone: "emerald" },
  expense: { label: "مصروف", tone: "rose" },
  debt: { label: "دين", tone: "amber" },
};

export default function Accounts({
  autoAdd,
  onConsumed,
}: {
  autoAdd: boolean;
  onConsumed: () => void;
}) {
  const { state, addTransaction, deleteTransaction } = useStore();
  const cur = state.settings.currency;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    date: todayISO(),
    type: "income" as TxType,
    amount: "",
    note: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (autoAdd) {
      setForm({ date: todayISO(), type: "income", amount: "", note: "" });
      setError("");
      setOpen(true);
      onConsumed();
    }
  }, [autoAdd, onConsumed]);

  const sorted = useMemo(
    () => [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : -1)),
    [state.transactions],
  );

  const submit = () => {
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) {
      setError("أدخل مبلغاً صحيحاً أكبر من صفر");
      return;
    }
    addTransaction({ date: form.date, type: form.type, amount, note: form.note.trim() });
    setForm({ date: todayISO(), type: "income", amount: "", note: "" });
    setError("");
    setOpen(false);
  };

  const sign = (t: TxType) => (t === "income" ? "+" : t === "expense" ? "−" : "");
  const signColor = (t: TxType) =>
    t === "income"
      ? "text-emerald-600 dark:text-emerald-400"
      : t === "expense"
        ? "text-rose-600 dark:text-rose-400"
        : "text-amber-600 dark:text-amber-400";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">الحسابات اليومية</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            عمليات مالية عامة خارج المزارع
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md active:scale-95 transition"
          aria-label="إضافة عملية"
        >
          <Plus size={24} />
        </button>
      </div>

      {sorted.length === 0 ? (
        <Card className="p-8 text-center text-sm text-slate-400">
          لا توجد عمليات بعد. اضغط زر + لإضافة أول عملية.
        </Card>
      ) : (
        <div className="space-y-2.5">
          {sorted.map((t) => {
            const meta = TYPE_META[t.type];
            return (
              <Card key={t.id} className="p-3.5 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                    <span className="text-xs text-slate-400">{formatDateShort(t.date)}</span>
                  </div>
                  <div className="mt-1 text-sm font-bold text-slate-700 dark:text-slate-200 truncate">
                    {t.note || "بدون بيان"}
                  </div>
                </div>
                <div className="text-left shrink-0 flex items-center gap-2">
                  <div className={`font-black text-base ${signColor(t.type)}`}>
                    {sign(t.type)}
                    {formatMoney(t.amount, cur)}
                  </div>
                  <button
                    onClick={() => deleteTransaction(t.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 transition"
                    aria-label="حذف"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="عملية جديدة">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="التاريخ">
              <DateInput
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </Field>
            <Field label="نوع العملية">
              <SelectInput
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as TxType })}
              >
                <option value="income">وارد</option>
                <option value="expense">مصروف</option>
                <option value="debt">دين</option>
              </SelectInput>
            </Field>
          </div>

          <Field label="المبلغ">
            <NumInput
              placeholder="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </Field>

          <Field label="اسم الشخص أو البيان">
            <TextInput
              placeholder="مثال: التاجر أحمد، إيجار محل…"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </Field>

          {error && <p className="text-sm font-bold text-rose-500">{error}</p>}

          <PrimaryButton onClick={submit}>حفظ العملية</PrimaryButton>
        </div>
      </Modal>
    </div>
  );
}
