import { useLang } from "@/i18n/LanguageContext";
import { useState, useEffect } from "react";

// الرموز المتاحة للضغط (6 رموز فرعونية)
const EGYPTIAN_SYMBOLS = [
  { id: "ankh", symbol: "𓋹", name: "Ankh (Life)" },
  { id: "was", symbol: "𓏙", name: "Was (Power)" },
  { id: "djed", symbol: "𓊽", name: "Djed (Stability)" },
  { id: "sa", symbol: "𓋴", name: "Sa (Protection)" },
  { id: "neb", symbol: "𓎟", name: "Neb (Lord)" },
  { id: "maat", symbol: "𓌙", name: "Maat (Truth)" }
];

// التسلسل الصحيح لفتح التابوت
const CORRECT_SEQUENCE = ["𓋴", "𓎟", "𓏙"]; // سا → نب → واز

export const VolunteeringSarcophagus = () => {
  const { t, lang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState(false);

  // تشغيل صوت الفتح عند حل اللغز
  useEffect(() => {
    if (isSolved && !isOpen) {
      const audio = new Audio("/audio/box.mp3");
      audio.play().catch(e => console.log("Audio play failed:", e));
      setIsOpen(true);
    }
  }, [isSolved, isOpen]);

  // معالجة الضغط على رمز
  const handleSymbolClick = (symbol: string) => {
    if (isOpen || isSolved) return;

    const newSequence = [...selectedSymbols, symbol];
    setSelectedSymbols(newSequence);

    // التحقق من صحة التسلسل حتى الآن
    const isCorrectSoFar = newSequence.every((s, i) => s === CORRECT_SEQUENCE[i]);

    if (newSequence.length === CORRECT_SEQUENCE.length) {
      if (isCorrectSoFar) {
        setIsSolved(true);
        setError(null);
      } else {
        setError(lang === "ar" ? "⚠️ التسلسل خاطئ. حاول مرة أخرى." : "⚠️ Wrong sequence. Try again.");
        setSelectedSymbols([]);
        // تشغيل صوت خطأ (اختياري - أنشئ ملف error.mp3 في public/audio إذا أردت)
        const errorAudio = new Audio("/audio/error.mp3");
        errorAudio.play().catch(() => {});
      }
    } else if (!isCorrectSoFar) {
      // لو اختار رمز خطأ في منتصف التسلسل
      setError(lang === "ar" ? "⚠️ رمز غير صحيح في هذا الترتيب. ابدأ من جديد." : "⚠️ Wrong symbol in this order. Start over.");
      setSelectedSymbols([]);
      const errorAudio = new Audio("/audio/error.mp3");
      errorAudio.play().catch(() => {});
    } else {
      // التسلسل صحيح جزئياً - نزيل الخطأ إن كان موجوداً
      setError(null);
    }
  };

  const resetPuzzle = () => {
    setSelectedSymbols([]);
    setError(null);
  };

  return (
    <section id="volunteering" className="relative py-32 container">
      <div className="flex flex-col items-center">
        <p className="font-display text-primary tracking-[0.5em] text-[10px] mb-4 uppercase">
          {t("vol.eyebrow")}
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-gold mb-12 text-center uppercase">
          {t("vol.title")}
        </h2>

        {/* التابوت التفاعلي مع اللغز */}
        <div
          className={`relative w-full max-w-3xl p-8 border-2 border-primary/30 bg-stone-900/40 backdrop-blur-md transition-all duration-700 group
          ${isOpen ? "shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)] border-primary" : ""}`}
        >
          {/* رموز القفل الملكي */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background px-4 text-primary text-2xl">
            {isOpen ? "𓄿" : "𓋴"}
          </div>

          {!isOpen ? (
            <div className="py-8 text-center">
              <p className="font-display text-primary/80 tracking-widest text-sm mb-6">
                {lang === "ar" ? "✦ رتب الرموز المقدسة لفتح أسفار القيادة ✦" : "✦ Arrange the sacred symbols to unlock the leadership scrolls ✦"}
              </p>

              {/* لوحة الرموز القابلة للنقر */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {EGYPTIAN_SYMBOLS.map((sym) => (
                  <button
                    key={sym.id}
                    onClick={() => handleSymbolClick(sym.symbol)}
                    disabled={isSolved}
                    className="text-5xl p-3 bg-stone-800/50 rounded-xl hover:bg-gold/20 hover:scale-110 transition-all duration-300 border border-primary/30 disabled:opacity-50"
                    title={sym.name}
                  >
                    {sym.symbol}
                  </button>
                ))}
              </div>

              {/* إظهار التسلسل الحالي */}
              <div className="mb-4">
                <p className="text-xs text-primary/60 mb-2">
                  {lang === "ar" ? "تسلسلك الحالي:" : "Your current sequence:"}
                </p>
                <div className="flex justify-center gap-3 text-3xl">
                  {selectedSymbols.length === 0 && <span className="text-primary/30">𓂀 𓂀 𓂀</span>}
                  {selectedSymbols.map((s, idx) => (
                    <span key={idx} className="bg-black/30 px-3 py-1 rounded">{s}</span>
                  ))}
                </div>
                {error && <p className="text-red-400 text-sm mt-3 animate-pulse">{error}</p>}
                {selectedSymbols.length > 0 && (
                  <button onClick={resetPuzzle} className="text-xs underline text-primary/50 mt-2">
                    {lang === "ar" ? "مسح التسلسل" : "Clear sequence"}
                  </button>
                )}
              </div>

              {/* تلميح خفيف (غير مزعج) */}
              <div className="mt-6 border-t border-primary/20 pt-6 text-primary/40 text-xs">
                {lang === "ar" ? "التسلسل الصحيح هو: 𓋴 ← 𓎟 ← 𓏙" : "Correct sequence: 𓋴 ← 𓎟 ← 𓏙"}
              </div>
            </div>
          ) : (
            <div className="reveal-up space-y-10 py-6">
              {/* المشروع التطوعي الأول */}
              <div className="relative group/item">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-gold text-2xl">𓋴</span>
                  <h3 className="text-xl font-display text-primary tracking-wider">
                    {t("vol.project1.title")}
                  </h3>
                </div>
                <p className="text-foreground/70 leading-relaxed pl-10 border-b border-primary/10 pb-5">
                  {t("vol.project1.desc")}
                </p>
                <p className="text-primary/50 text-xs pl-10 mt-2 font-mono">
                  🛠️ {t("vol.project1.tools")}
                </p>
              </div>

              {/* المشروع التطوعي الثاني */}
              <div className="relative group/item">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-gold text-2xl">𓎟</span>
                  <h3 className="text-xl font-display text-primary tracking-wider">
                    {t("vol.project2.title")}
                  </h3>
                </div>
                <p className="text-foreground/70 leading-relaxed pl-10 border-b border-primary/10 pb-5">
                  {t("vol.project2.desc")}
                </p>
                <p className="text-primary/50 text-xs pl-10 mt-2 font-mono">
                  🛠️ {t("vol.project2.tools")}
                </p>
              </div>

              {/* الخاتمة مع الدعوة للشات */}
              <div className="text-center pt-4 text-gold/60 text-sm border-t border-primary/20">
                𓊗 {t("vol.closing")} 𓊗
              </div>
            </div>
          )}

          {/* تأثير الضوء أو الدخان عند الفتح */}
          {isOpen && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-gold/10 to-transparent animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
