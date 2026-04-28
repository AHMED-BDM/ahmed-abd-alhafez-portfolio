import { useLang } from "@/i18n/LanguageContext";
import { useState } from "react";

export const VolunteeringSarcophagus = () => {
  const { t } = useLang();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="volunteering" className="relative py-32 container">
      <div className="flex flex-col items-center">
        <p className="font-display text-primary tracking-[0.5em] text-[10px] mb-4 uppercase">
          {t("vol.eyebrow")}
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-gold mb-12 text-center uppercase">
          {t("vol.title")}
        </h2>

        {/* التابوت التفاعلي */}
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-full max-w-3xl p-8 border-2 border-primary/30 bg-stone-900/40 backdrop-blur-md cursor-pointer transition-all duration-700 group
          ${isOpen ? "shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)] border-primary" : "hover:border-primary/60 hover:shadow-gold"}`}
        >
          {/* رموز القفل الملكي */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-background px-4 text-primary text-2xl group-hover:animate-bounce">
            {isOpen ? "𓄿" : "𓋴"}
          </div>

          {!isOpen ? (
            <div className="py-12 text-center">
              <p className="font-display text-primary/60 tracking-widest text-sm animate-pulse">
                {t("vol.solve")}
              </p>
              <div className="mt-6 flex justify-center gap-4 text-primary/30 text-3xl">
                <span>𓍿</span><span>𓎟</span><span>𓏏</span>
              </div>
            </div>
          ) : (
            <div className="reveal-up space-y-12 py-6">
              {/* المقدمة القيادية */}
              <div className="border-l-2 border-primary/40 pl-6 italic text-foreground/80 leading-relaxed">
                {t("vol.p1")}
              </div>

              {/* المشروع القيادي الأول */}
              <div className="relative group/item">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-gold text-2xl">𓋹</span>
                  <h3 className="text-xl font-display text-primary uppercase tracking-wider">
                    {t("vol.project1.title")}
                  </h3>
                </div>
                <p className="text-foreground/70 leading-relaxed pl-10 border-b border-primary/10 pb-6">
                  {t("vol.project1.desc")}
                </p>
              </div>

              {/* المشروع القيادي الثاني */}
              <div className="relative group/item">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-gold text-2xl">𓂀</span>
                  <h3 className="text-xl font-display text-primary uppercase tracking-wider">
                    {t("vol.project2.title")}
                  </h3>
                </div>
                <p className="text-foreground/70 leading-relaxed pl-10">
                  {t("vol.project2.desc")}
                </p>
              </div>

              {/* ختم الخاتمة */}
              <div className="text-center pt-8 text-primary/20 text-4xl select-none">
                𓊗 𓊗 𓊗
              </div>
            </div>
          )}

          {/* تأثير الدخان الخفيف عند الفتح */}
          {isOpen && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
