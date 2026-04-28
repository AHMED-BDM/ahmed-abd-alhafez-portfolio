import { useEffect, useState, useRef, useMemo } from "react";
import gateImg from "@/assets/gate-door.jpg";
import { useLang } from "@/i18n/LanguageContext";
import { DustEffect } from "./DustEffect";
import { sounds } from "@/audio";

const GLYPHS = ["𓂀", "𓋹", "𓆣", "𓊪"];

export const EntryGate = ({ onEnter }: { onEnter: () => void }) => {
  const { t } = useLang();
  const [opening, setOpening] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [armed, setArmed] = useState(false);
  const [dials, setDials] = useState([0, 1, 2]);
  const [imgLoaded, setImgLoaded] = useState(false);
  const portalRef = useRef<HTMLDivElement>(null);

  // تحميل مسبق للصورة
  useEffect(() => {
    const img = new Image();
    img.src = gateImg;
    img.onload = () => {
      setTimeout(() => setImgLoaded(true), 100);
    };
  }, []);

  const playGateSound = () => {
    if (sounds.gate) {
      sounds.gate.currentTime = 0;
      sounds.gate.volume = 0.85;
      sounds.gate.play().catch(e => console.error("Sound play failed:", e));
    }
  };

  useEffect(() => {
    const isSolved = dials.every(v => v === dials[0]);
    if (isSolved && !armed) {
      setArmed(true);
      setTimeout(() => {
        setOpening(true);
        playGateSound();
        // 5.2 ثانية لإخفاء البوابة بعد اكتمال الفتح (5 ثوان حركة + 0.2 أمان)
        setTimeout(() => {
          setHidden(true);
          onEnter();
        }, 5200);
      }, 650); // تأخير بسيط قبل بدء الفتح لبناء الترقب
    }
  }, [dials, armed, onEnter]);

  const handleDialClick = (idx: number) => {
    if (armed) return;
    const newDials = [...dials];
    newDials[idx] = (newDials[idx] + 1) % GLYPHS.length;
    setDials(newDials);
  };

  // حفظ الجزيئات الذهبية في الذاكرة لعدم استهلاك أداة المعالج مع كل تحديث (Rendering)
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 1.5 + Math.random() * 2,
      tx: Math.random() * 100 - 50,
      ty: Math.random() * -200 - 50,
    }));
  }, []);

  if (hidden) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden flex items-center justify-center">
      {/* الطبقة الرئيسية التي تظهر بعد تحميل الصورة */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          imgLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* تأثير الإضاءة الخلفية المتوهجة أثناء الفتح (تم نقله ليعمل بالشفافية لزيادة الأداء) */}
        <div
          className="absolute inset-0 z-0 pointer-events-none transform-gpu"
          style={{
            transition: "all 5s cubic-bezier(0.5, 0, 0.1, 1)",
            opacity: opening ? 1 : 0,
            background: `radial-gradient(ellipse at center, 
              rgba(212, 175, 55, 0.3) 0%, 
              rgba(180, 120, 40, 0.15) 40%,
              transparent 80%)`,
            transform: `scale(${opening ? 1.2 : 0.8}) translateZ(0)`,
          }}
        />

        <DustEffect isActive={opening} />

        {/* الحاوية الرئيسية للأبواب مع إضافة تأثير الاهتزاز الحقيقي */}
        <div
          className="absolute inset-0 flex z-10 will-change-transform"
          style={{
            perspective: "1800px",
            perspectiveOrigin: "center",
            animation: opening ? "templeShake 1.5s ease-in-out 0s 1" : "none",
          }}
        >
          {/* انعكاس ذهبي داخلي (مفصول عن الأبواب لعدم التسبب في Repaint) */}
          <div
            className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-[5000ms]"
            style={{
              opacity: opening ? 1 : 0,
              boxShadow: "inset 0 0 100px rgba(212, 175, 55, 0.5), 0 0 120px rgba(212, 175, 55, 0.2)",
            }}
          />

          {/* الباب الأيسر */}
          <div
            className="w-1/2 h-full bg-cover bg-right border-r border-primary/20 transform-gpu will-change-transform relative"
            style={{
              backgroundImage: `url(${gateImg})`,
              backgroundPosition: "right",
              transformOrigin: "left center",
              transition: "transform 5s cubic-bezier(0.5, 0, 0.1, 1)", // منحنى حركة يحاكي وزن الحجر بدقة
              transform: opening
                ? "rotateY(-105deg) translate3d(-10px, 0, 0)"
                : "rotateY(0deg) translate3d(0, 0, 0)",
            }}
          >
             {/* حافة الباب المعتمة لإعطاء عمق 3D عند الفتح */}
             <div className="absolute top-0 right-0 w-4 h-full bg-black/40 transition-opacity duration-[5000ms]" style={{ opacity: opening ? 1 : 0 }} />
          </div>

          {/* الباب الأيمن */}
          <div
            className="w-1/2 h-full bg-cover bg-left border-l border-primary/20 transform-gpu will-change-transform relative"
            style={{
              backgroundImage: `url(${gateImg})`,
              backgroundPosition: "left",
              transformOrigin: "right center",
              transition: "transform 5s cubic-bezier(0.5, 0, 0.1, 1)",
              transform: opening
                ? "rotateY(105deg) translate3d(10px, 0, 0)"
                : "rotateY(0deg) translate3d(0, 0, 0)",
            }}
          >
             {/* حافة الباب المعتمة لإعطاء عمق 3D عند الفتح */}
             <div className="absolute top-0 left-0 w-4 h-full bg-black/40 transition-opacity duration-[5000ms]" style={{ opacity: opening ? 1 : 0 }} />
          </div>
        </div>

        {/* واجهة اللغز */}
        <div
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-6"
          style={{
            transition: "all 1.5s ease-out",
            opacity: opening ? 0 : 1,
            transform: `translate(-50%, ${opening ? "50px" : "0"})`,
            pointerEvents: opening ? "none" : "auto",
          }}
        >
          <p className="font-display text-primary/70 text-[10px] tracking-[0.4em] uppercase animate-pulse drop-shadow-md">
            {armed ? "انكسر الختم القديم" : "طابق الرموز لفتح المعبد"}
          </p>

          <div className="flex gap-4 p-4 bg-black/60 backdrop-blur-md border border-primary/20 rounded-md shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            {dials.map((val, i) => (
              <button
                key={i}
                onClick={() => handleDialClick(i)}
                disabled={armed}
                className={`w-14 h-16 flex items-center justify-center bg-stone-900 border-2 transition-all duration-500 transform-gpu hover:scale-105
                  ${armed
                    ? "border-primary shadow-[0_0_25px_var(--primary)] scale-105"
                    : "border-primary/30 hover:border-primary/70"
                  }`}
              >
                <span
                  className={`text-3xl select-none transition-all duration-500 ${
                    armed ? "text-primary scale-110 drop-shadow-[0_0_10px_var(--primary)]" : "text-primary/60"
                  }`}
                >
                  {GLYPHS[val]}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setHidden(true);
              onEnter();
            }}
            className="mt-4 text-[9px] font-display tracking-[0.2em] text-primary/30 hover:text-primary transition-colors"
          >
            {t("gate.skip")}
          </button>
        </div>

        {/* وميض أبيض عند بدء الفتح يختفي بسرعة */}
        <div
          className="absolute inset-0 z-40 pointer-events-none bg-white"
          style={{
            transition: "opacity 1s ease-out",
            opacity: armed && !opening ? 0.15 : 0,
          }}
        />

        {/* تأثير جزيئات ذهبية متطايرة أثناء الفتح (مُحسنة الأداء) */}
        {opening && (
          <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
            {particles.map((p, i) => (
              <div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  top: p.top,
                  left: p.left,
                  backgroundColor: "#D4AF37",
                  boxShadow: "0 0 8px #D4AF37",
                  // استخدام المتغيرات الديناميكية لـ CSS للأنيميشن بدلاً من إنشائها نصياً مع كل عنصر
                  animation: `glowParticle ${p.duration}s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`,
                  ['--tx' as string]: `${p.tx}px`,
                  ['--ty' as string]: `${p.ty}px`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        /* اهتزاز أثقل وأكثر واقعية لحجر ضخم */
        @keyframes templeShake {
          0% { transform: translate3d(0, 0, 0); }
          10% { transform: translate3d(3px, -2px, 0); }
          20% { transform: translate3d(-3px, 2px, 0); }
          30% { transform: translate3d(2px, -3px, 0); }
          40% { transform: translate3d(-2px, 3px, 0); }
          50% { transform: translate3d(1px, -1px, 0); }
          60% { transform: translate3d(-1px, 1px, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        
        /* حركة الجزيئات باستخدام المتغيرات للأداء */
        @keyframes glowParticle {
          0% {
            transform: scale(0) translate3d(0, 0, 0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: scale(1.8) translate3d(var(--tx), var(--ty), 0);
            opacity: 0;
          }
        }
        
        .will-change-transform {
          will-change: transform;
        }
        
        .transform-gpu {
          transform: translate3d(0, 0, 0);
        }
      `}</style>
    </div>
  );
};
