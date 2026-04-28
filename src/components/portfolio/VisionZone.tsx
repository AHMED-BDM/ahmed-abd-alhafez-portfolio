import { useLang } from "@/i18n/LanguageContext";

/**
 * VisionZone: الآن هو القسم الذي يعرض "الرؤية الفرعونية" بالصولجان
 * يظهر في منتصف الموقع بإطار ملكي متوهج
 */
export const VisionZone = ({ mode }: { mode: "night" | "day" }) => {
  const { t } = useLang();

  return (
    <section className="relative py-32 flex flex-col items-center justify-center overflow-hidden">
      {/* تأثير هالة ضوئية خلف الصورة */}
      <div 
        className={`absolute w-[500px] h-[500px] rounded-full blur-[120px] transition-opacity duration-1000
        ${mode === "night" ? "bg-primary/10 opacity-60" : "bg-primary/20 opacity-40"}`} 
      />
      
      <div className="relative z-10 flex flex-col items-center group">
        {/* النص العلوي (رؤية الكاتب) */}
        <span className="text-primary/40 font-display tracking-[0.8em] text-[10px] mb-10 uppercase animate-pulse">
          {t("mid.spirit")}
        </span>
        
        {/* الإطار الدائري للصورة الفرعونية */}
        <div className="relative p-1.5 border-2 border-primary/20 rounded-full bg-black/40 backdrop-blur-sm shadow-[0_0_50px_rgba(var(--primary-rgb),0.1)] transition-all duration-700 group-hover:shadow-[0_0_80px_rgba(var(--primary-rgb),0.3)] group-hover:border-primary/40">
          
          <div className="relative overflow-hidden rounded-full w-64 h-64 md:w-80 md:h-80 border-4 border-double border-primary/30 group-hover:border-primary/60 transition-colors duration-700">
            {/* 🖼️ صورتك الفرعونية بالصولجان */}
            <img 
              src="/personal-photo.png" 
              className={`w-full h-full object-cover transition-all duration-[1500ms] ease-out group-hover:scale-110 
              ${mode === "night" ? "brightness-90 contrast-110 grayscale-[0.2]" : "brightness-105"}`}
              alt="The Ancient Spirit"
            />
            
            {/* تأثير ضوئي متحرك فوق الصورة */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>

          {/* رموز فرعونية حول الإطار */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-primary text-3xl drop-shadow-[0_0_10px_var(--primary)] animate-bounce">𓂀</div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-primary text-3xl drop-shadow-[0_0_10px_var(--primary)]">𓋹</div>
        </div>

        {/* خط زخرفي تحت الصورة */}
        <div className="mt-12 w-24 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>
    </section>
  );
};
