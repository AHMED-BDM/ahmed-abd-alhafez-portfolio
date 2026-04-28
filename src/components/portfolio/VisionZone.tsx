import { useLang } from "@/i18n/LanguageContext";

/**
 * VisionZone Section
 * عرض "روح الكاتب" بالصولجان في منتصف الرحلة الرقمية
 */
export const VisionZone = ({ mode }: { mode: "night" | "day" }) => {
  const { t } = useLang();

  return (
    <section className="relative py-40 flex flex-col items-center justify-center overflow-hidden">
      {/* هالة مقدسة خلفية */}
      <div 
        className={`absolute w-[600px] h-[600px] rounded-full blur-[150px] transition-all duration-1000
        ${mode === "night" ? "bg-primary/20 opacity-40" : "bg-primary/30 opacity-20"}`} 
      />
      
      <div className="relative z-10 flex flex-col items-center group">
        {/* نداء الروح */}
        <span className="text-primary/50 font-display tracking-[1.2em] text-[11px] mb-12 uppercase animate-pulse">
          {t("mid.spirit")}
        </span>
        
        {/* الدرع الملكي للصورة */}
        <div className="relative p-3 border-4 border-double border-primary/20 rounded-full bg-stone-900/40 backdrop-blur-xl shadow-[0_0_60px_rgba(var(--primary-rgb),0.15)] transition-all duration-1000 group-hover:shadow-[0_0_100px_rgba(var(--primary-rgb),0.4)] group-hover:border-primary/50">
          
          {/* حاوية الصورة الدائرية */}
          <div className="relative overflow-hidden rounded-full w-72 h-72 md:w-[400px] md:h-[400px] border-2 border-primary/30 group-hover:border-primary/80 transition-all duration-700">
            
            {/* ✅ صورتك بالصولجان (Personal) */}
            <img 
              src="/personal-photo.png" 
              className={`w-full h-full object-cover transition-all duration-[2000ms] ease-out group-hover:scale-[1.15] 
              ${mode === "night" ? "brightness-75 contrast-125" : "brightness-100"}`}
              alt="The Eternal Scribe - Scepter Vision"
            />
            
            {/* لمعان ذهبي متحرك */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          </div>

          {/* رموز القوة الأبدية */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-primary text-6xl drop-shadow-[0_0_20px_var(--primary)] animate-pulse" style={{ animationDuration: '4s' }}>
            𓂀
          </div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-primary text-6xl drop-shadow-[0_0_20px_var(--primary)] transition-transform group-hover:scale-125 duration-700">
            𓋹
          </div>
        </div>

        {/* خطوط الطاقة الفرعونية */}
        <div className="mt-20 flex items-center gap-6 opacity-40">
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent" />
          <span className="text-primary font-display text-sm tracking-[0.5em] italic">ETERNAL LEGACY</span>
          <div className="w-32 h-[1px] bg-gradient-to-l from-transparent via-primary to-transparent" />
        </div>
      </div>
    </section>
  );
};
