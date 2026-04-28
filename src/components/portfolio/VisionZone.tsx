import { useLang } from "@/i18n/LanguageContext";

/**
 * VisionZone Section
 * يعرض الصورة الإبداعية (بالصولجان) في منتصف الصفحة
 * تم استخدام Tailwind CSS لإضافة تأثيرات التوهج والبرواز المزدوج
 */
export const VisionZone = ({ mode }: { mode: "night" | "day" }) => {
  const { t } = useLang();

  return (
    <section className="relative py-32 flex flex-col items-center justify-center overflow-hidden">
      {/* هالة ضوئية خلفية لتعطي عمقاً للصورة */}
      <div 
        className={`absolute w-[500px] h-[500px] rounded-full blur-[120px] transition-opacity duration-1000
        ${mode === "night" ? "bg-primary/10 opacity-60" : "bg-primary/20 opacity-40"}`} 
      />
      
      <div className="relative z-10 flex flex-col items-center group">
        {/* عنوان القسم الصغير - يظهر من القاموس */}
        <span className="text-primary/40 font-display tracking-[1em] text-[10px] mb-10 uppercase animate-pulse">
          {t("mid.spirit")}
        </span>
        
        {/* الإطار الدائري الفخم */}
        <div className="relative p-2 border-2 border-primary/20 rounded-full bg-black/40 backdrop-blur-md shadow-[0_0_50px_rgba(var(--primary-rgb),0.1)] transition-all duration-700 group-hover:shadow-[0_0_80px_rgba(var(--primary-rgb),0.3)] group-hover:border-primary/40">
          
          {/* حاوية الصورة المفرغة */}
          <div className="relative overflow-hidden rounded-full w-72 h-72 md:w-96 md:h-96 border-4 border-double border-primary/30 group-hover:border-primary/60 transition-colors duration-700">
            
            {/* ✅ الصورة الفرعونية بالصولجان (PNG) */}
            <img 
              src="/personal-photo.png" 
              className={`w-full h-full object-cover transition-all duration-[1500ms] ease-out group-hover:scale-110 
              ${mode === "night" ? "brightness-90 contrast-110 grayscale-[0.1]" : "brightness-105"}`}
              alt="The Ancient Scribe Spirit"
            />
            
            {/* تأثير ضوئي متحرك يمر فوق الصورة عند الحركية */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>

          {/* رموز فرعونية زينة (عين حورس ومفتاح الحياة) */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-primary text-4xl drop-shadow-[0_0_15px_var(--primary)] animate-bounce" style={{ animationDuration: '3s' }}>
            𓂀
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-primary text-4xl drop-shadow-[0_0_15px_var(--primary)]">
            𓋹
          </div>
        </div>

        {/* زخرفة سفلية بسيطة لربط القسم بما بعده */}
        <div className="mt-16 flex items-center gap-4 opacity-30">
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent to-primary" />
          <span className="text-primary text-xs tracking-widest uppercase italic">The Legacy</span>
          <div className="w-20 h-[1px] bg-gradient-to-l from-transparent to-primary" />
        </div>
      </div>
    </section>
  );
};
