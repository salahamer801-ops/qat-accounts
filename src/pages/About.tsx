import { ArrowRight, Code2, Info, Leaf, ShieldCheck } from "lucide-react";
import { Card, SectionTitle } from "../components/ui";

const VERSION = "1.0.0";

export default function About({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-5">
      <div className="pt-1 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">حول التطبيق</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">معلومات التطبيق وشروط الاستخدام</p>
        </div>
        <button
          onClick={onBack}
          className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="رجوع"
        >
          <ArrowRight size={22} />
        </button>
      </div>

      <Card className="p-6 text-center space-y-4">
        <div className="mx-auto w-24 h-24 rounded-3xl overflow-hidden shadow-lg ring-4 ring-emerald-100 dark:ring-emerald-900/40">
          <img
            src="/icons/icon-192.png"
            alt="شعار حسابات القات"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">حسابات القات</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            إدارة الحسابات اليومية ومزارع القات
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-bold px-3 py-1">
          <Info size={14} /> الإصدار {VERSION}
        </div>
      </Card>

      <div className="space-y-3">
        <SectionTitle className="flex items-center gap-2">
          <Leaf size={18} className="text-emerald-600" /> عن التطبيق
        </SectionTitle>
        <Card className="p-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <p>
            تطبيق <span className="font-bold text-slate-800 dark:text-slate-100">حسابات القات</span> يساعدك
            على إدارة حساباتك اليومية ومزارع القات بكل سهولة: تسجيل المبيعات والمصروفات، متابعة الديون،
            وحساب صافي الربح لكل مزرعة على حدة، مع إمكانية تصدير التقارير ومشاركتها.
          </p>
          <p>
            يعمل التطبيق بدون إنترنت بعد التثبيت، وتُحفظ جميع بياناتك على جهازك فقط ولا تُرسل إلى أي
            خادم خارجي.
          </p>
        </Card>
      </div>

      <div className="space-y-3">
        <SectionTitle className="flex items-center gap-2">
          <Code2 size={18} className="text-emerald-600" /> البرمجة والتطوير
        </SectionTitle>
        <Card className="p-4 flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Code2 size={22} />
          </span>
          <div>
            <div className="font-extrabold text-slate-800 dark:text-slate-100">
              برمجة المهندس/ عبدالملك عامر
            </div>
            <div className="text-xs text-slate-400">جميع حقوق التطوير والبرمجة محفوظة</div>
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        <SectionTitle className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-600" /> شروط الاستخدام
        </SectionTitle>
        <Card className="p-4 space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <p>
            باستخدامك هذا التطبيق فأنت توافق على الشروط التالية:
          </p>
          <ul className="list-disc pr-5 space-y-2">
            <li>
              التطبيق أداة لتنظيم وحفظ الحسابات الشخصية، ولا يقدّم أي استشارة مالية أو قانونية أو ضريبية.
            </li>
            <li>
              البيانات المُدخلة تقع مسؤوليتها على المستخدم، ويُنصح بالاحتفاظ بنسخة احتياطية دورية عبر التصدير.
            </li>
            <li>
              تُحفظ البيانات محلياً على جهاز المستخدم، والتطبيق غير مسؤول عن فقدانها بسبب حذف التطبيق أو تلف الجهاز.
            </li>
            <li>
              يُستخدم التطبيق للأغراض المشروعة فقط، ولا يجوز إساءة استخدامه أو إعادة توزيعه أو تعديله دون إذن المطوّر.
            </li>
            <li>
              يظل التطبيق وعلامته وشعاره ملكاً للمطوّر، ويُحظر استخدامها لأغراض تجارية دون موافقة مسبقة.
            </li>
          </ul>
          <p className="text-slate-400">
            © {new Date().getFullYear()} — برمجة المهندس/ عبدالملك عامر. جميع الحقوق محفوظة.
          </p>
        </Card>
      </div>
    </div>
  );
}
