import { useLang } from "@/i18n/LanguageContext";
import { useState, useEffect, useRef } from "react";

// الرموز المتاحة – ستة رموز فرعونية جميلة
const SYMBOLS = [
  { sym: "𓋴", name: "Sa (Protection)" },
  { sym: "𓎟", name: "Neb (Lord)" },
  { sym: "𓏙", name: "Was (Power)" },
  { sym: "𓋹", name: "Ankh (Life)" },
  { sym: "𓊽", name: "Djed (Stability)" },
  { sym: "𓌙", name: "Maat (Truth)" }
];

// التسلسل الصحيح (سهل التذكر: سا → نِب → واز)
const CORRECT_SEQUENCE = ["𓋴", "𓎟", "𓏙"];

export const VolunteeringSarcophagus = () => {
  const { t, lang } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState(false);
  
  // مرجع لصوت الخطأ لإيقافه فوراً
  const errorAudioRef = useRef<HTMLAudioElement | null>(null);

  // تشغيل صوت الفتح عند الحل
  useEffect(() => {
    if (isSolved && !isOpen) {
      // إيقاف أي صوت خطأ قيد التشغيل
      if (errorAudioRef.current) {
        errorAudioRef.current.pause();
        errorAudioRef.current.currentTime = 0;
      }
      const boxAudio = new Audio("/audio/box.mp3");
      boxAudio.play().catch(e => console.log("Box audio error:", e));
      setIsOpen(true);
    }
  }, [isSolved, isOpen]);

  // التعامل مع الضغط على الرمز
  const handleSymbolClick = (sym: string) => {
    if (isSolved || isOpen) return;

    const newSeq = [...selected, sym];
    setSelected(newSeq);

    // التحقق من صحة التسلسل حتى الآن
    let valid = true;
    for (let i = 0; i < newSeq.length; i++) {
      if (newSeq[i] !== CORRECT_SEQUENCE[i]) {
        valid = false;
        break;
      }
    }

    if (!valid) {
      // خطأ: تشغيل صوت الخطأ وإظهار رسالة
      if (errorAudioRef.current) {
        errorAudioRef.current.pause();
        errorAudioRef.current.currentTime = 0;
      }
      const errorAudio = new Audio("/audio/error.mp3");
      errorAudioRef.current = errorAudio;
      errorAudio.play().catch(e => console.log("Error audio:", e));
      
      setErrorMsg(lang === "ar" ? "❌ تسلسل خاطئ! ابدأ من جديد." : "❌ Wrong sequence! Start over.");
      setSelected([]);
      return;
    }

    // إذا كان التسلسل صحيحاً جزئياً
    setErrorMsg(null);

    // إذا اكتمل التسلسل الصحيح
    if (newSeq.length === CORRECT_SEQUENCE.length) {
      // إيقاف أي صوت خطأ
      if (errorAudioRef.current) {
        errorAudioRef.current.pause();
        errorAudioRef.current.currentTime = 0;
      }
      setIsSolved(true);
    }
  };

  const resetPuzzle = () => {
    if (errorAudioRef.current) {
      errorAudioRef.current.pause();
      errorAudioRef.current.currentTime = 0;
    }
    setSelected([]);
    setErrorMsg(null);
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

        <div className="relative w-full max-w-3xl p-8 border-2 border-primary/30 bg-stone-900/40 backdrop-blur-md transition-all duration-700 group">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background px-4 text-primary text-2xl">
            {isOpen ? "𓄿" : "𓋴"}
          </div>

          {!isOpen ? (
            <div className="py-6 text-center">
              <p className="font-display text-primary/80 tracking-widest text-sm mb-6">
                {t("vol.solve")}
              </p>
              
              {/* لوحة الرموز - تصميم جذاب وسهل */}
              <div className="flex flex-wrap justify-center gap-5 mb-8">
                {SYMBOLS.map((item) => (
                  <button
                    key={item.sym}
                    onClick={() => handleSymbolClick(item.sym)}
                    disabled={isSolved}
                    className="text-6xl p-4 bg-stone-800/60 rounded-2xl hover:bg-gold/30 hover:scale-110 transition-all duration-200 border-2 border-primary/40 shadow-lg disabled:opacity-50"
                    title={item.name}
                  >
                    {item.sym}
                  </button>
                ))}
              </div>

              {/* عرض التسلسل الحالي */}
              <div className="mb-5">
                <p className="text-xs text-primary/60 mb-2">
                  {lang === "ar" ? "تسلسلك:" : "Your sequence:"}
                </p>
                <div className="flex justify-center gap-3 text-4xl">
                  {selected.length === 0 && <span className="text-primary/30 text-2xl">❓ ❓ ❓</span>}
                  {selected.map((s, idx) => (
                    <span key={idx} className="bg-black/40 px-4 py-2 rounded-xl border border-primary/40">{s}</span>
                  ))}
                </div>
                {errorMsg && <p className="text-red-400 text-sm mt-3 animate-pulse">{errorMsg}</p>}
                {selected.length > 0 && (
                  <button onClick={resetPuzzle} className="text-xs underline text-primary/60 mt-3 hover:text-primary">
                    {lang === "ar" ? "🗑️ مسح التسلسل" : "🗑️ Clear sequence"}
                  </button>
                )}
              </div>

              {/* تلميح خفيف (اختياري) */}
              <div className="mt-4 text-primary/30 text-[11px] italic">
                {lang === "ar" ? "تلميح: التسلسل الصحيح هو 𓋴 ثم 𓎟 ثم 𓏙" : "Hint: Correct sequence is 𓋴 then 𓎟 then 𓏙"}
              </div>
            </div>
          ) : (
            <div className="reveal-up space-y-8 py-6">
              {/* المشروع التطوعي الأول */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-gold text-2xl">𓋴</span>
                  <h3 className="text-xl font-display text-primary tracking-wider">
                    {t("vol.project1.title")}
                  </h3>
                </div>
                <p className="text-foreground/70 leading-relaxed pl-8 text-sm">
                  {t("vol.project1.desc")}
                </p>
                <p className="text-primary/50 text-xs pl-8 font-mono">
                  🛠️ {t("vol.project1.tools")}
                </p>
              </div>

              {/* المشروع التطوعي الثاني */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-gold text-2xl">𓎟</span>
                  <h3 className="text-xl font-display text-primary tracking-wider">
                    {t("vol.project2.title")}
                  </h3>
                </div>
                <p className="text-foreground/70 leading-relaxed pl-8 text-sm">
                  {t("vol.project2.desc")}
                </p>
                <p className="text-primary/50 text-xs pl-8 font-mono">
                  🛠️ {t("vol.project2.tools")}
                </p>
              </div>

              {/* الخاتمة */}
              <div className="text-center pt-4 text-gold/70 text-sm border-t border-primary/20">
                𓊗 {t("vol.closing")} 𓊗
              </div>
            </div>
          )}

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
