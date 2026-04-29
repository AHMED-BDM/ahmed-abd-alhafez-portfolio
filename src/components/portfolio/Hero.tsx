import { useLang } from "@/i18n/LanguageContext";
import heroNight from "@/assets/hero-temple-night.jpg";
import heroDay from "@/assets/hero-temple-day.jpg";

export const Hero = ({ mode, onOpenBox }: { mode: "night" | "day", onOpenBox: () => void }) => {
  const { t } = useLang();

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      {/* خلفية المعبد الأزلية */}
      <img
        src={mode === "night" ? heroNight : heroDay}
        alt="Ancient Egyptian temple"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        width={1920} 
        height={1280}
      />
      <div className="absolute inset-0 bg-background/55 backdrop-blur-[1px]" />

      <div className="relative z-10 container grid md:grid-cols-2 gap-12 items-center py-20">
        {/* نداء الكاتب - الجانب النصي */}
        <div className="reveal-up">
          <p className="font-display text-primary tracking-[0.5em] text-xs mb-6 uppercase animate-pulse">
            {t("hero.eyebrow")}
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-black leading-[1.05] mb-6">
            <span className="text-gold block drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
              {t("hero.name1")}
            </span>
            <span className="text-gold block drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
              {t("hero.name2")}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-foreground/90 italic mb-3 max-w-xl">
            {t("hero.role")}
          </p>
          <p className="text-foreground/70 max-w-lg mb-10 leading-relaxed">
            {t("hero.tagline")}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a href="#about"
              className="group relative px-8 py-3 font-display tracking-widest text-sm bg-primary text-primary-foreground gold-frame hover:shadow-gold transition-all duration-500">
              {t("hero.cta1")}
            </a>
            <a href="#projects"
              className="px-8 py-3 font-display tracking-widest text-sm border-2 border-primary/50 text-primary hover:bg-primary/10 transition-all duration-500">
              {t("hero.cta2")}
            </a>
          </div>
        </div>

        {/* التابوت الملكي - الجانب البصري */}
        <div className="relative flex justify-center reveal-up" style={{ animationDelay: "0.3s" }} onClick={onOpenBox}>
          <div className="absolute inset-0 rounded-full blur-3xl bg-primary/20 animate-pulse" />
          
          <div className="relative group cursor-pointer transition-all duration-700 hover:rotate-1" style={{ width: "min(24rem, 90vw)" }}>
            <div className="relative p-4 rounded-md gold-frame bg-gradient-to-b from-amber-900/40 via-card/60 to-amber-900/40 backdrop-blur-sm shadow-gold overflow-hidden">
              
              {/* شريط الرموز العلوي */}
              <div className="absolute top-0 left-0 right-0 h-7 flex items-center justify-around px-3 text-primary/80 font-display text-sm tracking-widest bg-gradient-to-b from-background/80 to-transparent border-b border-primary/40">
                <span>𓂀</span><span>𓋹</span><span>𓆣</span><span>𓋹</span><span>𓂀</span>
              </div>

              {/* حاوية الصورة الرسمية */}
              <div className="relative my-7 p-[3px] bg-gradient-to-br from-amber-300 via-yellow-600 to-amber-800 rounded-sm">
                <div className="p-[2px] bg-background/50 rounded-sm overflow-hidden aspect-square relative">
                  <img 
                    src="/professional-photo.jpeg" 
                    alt="Ahmed Abd Al-Hafez - Grand Architect" 
                    className="w-full h-full object-cover object-top transition-all duration-1000 group-hover:scale-110 group-hover:brightness-110" 
                    loading="eager"
                  />
                  <div className="pointer-events-none absolute inset-0 shimmer-gold opacity-20 group-hover:opacity-40" />
                  
                  {/* أختام الزوايا */}
                  <span className="absolute top-1 left-1 text-primary/60 text-[10px]">𓋹</span>
                  <span className="absolute top-1 right-1 text-primary/60 text-[10px]">𓋹</span>
                  <span className="absolute bottom-1 left-1 text-primary/60 text-[10px]">𓂀</span>
                  <span className="absolute bottom-1 right-1 text-primary/60 text-[10px]">𓂀</span>
                </div>
              </div>

              {/* شريط الرموز السفلي */}
              <div className="absolute bottom-0 left-0 right-0 h-7 flex items-center justify-around px-3 text-primary/80 font-display text-sm tracking-widest bg-gradient-to-t from-background/80 to-transparent border-t border-primary/40">
                <span>𓋴</span><span>𓎟</span><span>𓍿</span><span>𓎟</span><span>𓋴</span>
              </div>
            </div>

            {/* الخرطوش الملكي (الاسم) */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-background/95 border-2 border-primary/70 shadow-gold whitespace-nowrap z-20 transition-all group-hover:scale-110">
              <span className="font-display text-primary text-[10px] tracking-[0.4em] uppercase">
                𓋹 · {t("hero.name1")} {t("hero.name2")} · 𓋹
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary text-2xl animate-bounce opacity-40">
        𓂀
      </div>
    </section>
  );
};
