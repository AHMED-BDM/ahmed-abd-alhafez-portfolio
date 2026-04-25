import { useState } from "react";
import { SectionTitle } from "./About";
import cert1 from "@/assets/cert-google-data.png";
import cert2 from "@/assets/cert-ibm-ai.jpg";
import cert3 from "@/assets/cert-deep-learning.jpg";
import cert4 from "@/assets/cert-edraak-decision.png";
import cert5 from "@/assets/cert-canva-essentials.png";
import cert6 from "@/assets/cert-microsoft-dax.png";
import { X } from "lucide-react";
import { Sarcophagus } from "./Sarcophagus";
import { useLang, T } from "@/i18n/LanguageContext";

const certs = [
  { img: cert1, link: "https://coursera.org/verify/professional-cert/4V3WLQA2B3PL" },
  { img: cert2, link: "https://www.credly.com/badges/10d8a0f5-6fdc-44e2-a2e6-195c5c1e398f" },
  { img: cert3, link: "#" },
  { img: cert4, link: "#" },
  { img: cert5, link: "#" },
  { img: cert6, link: "#" },
];

export const Certificates = () => {
  const { t } = useLang();
  const [open, setOpen] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [unsealed, setUnsealed] = useState(false);
  const tt = (i: number, k: "title" | "issuer" | "date") => t(`ci.${i}.${k}` as keyof typeof T);

  return (
    <section id="certificates" className="relative py-28 px-6 overflow-hidden">
      <div className="container max-w-6xl">
        <SectionTitle eyebrow={t("cert.eyebrow")} title={t("cert.title")} />
        {!unsealed ? (
          <Sarcophagus label={t("cert.sealLabel")} onOpen={() => setUnsealed(true)} />
        ) : (
        <>
        <p className="text-center text-foreground/70 max-w-2xl mx-auto -mt-8 mb-12 italic reveal-up">
          {t("cert.intro")}
        </p>
        <div className="grid md:grid-cols-3 gap-10 reveal-up">
          {certs.map((c, i) => {
            const isRevealed = revealed.has(i);
            return (
              <div key={i}
                onMouseEnter={() => setRevealed(prev => new Set(prev).add(i))}
                onTouchStart={() => setRevealed(prev => new Set(prev).add(i))}
                onClick={() => setOpen(i)}
                className="group relative cursor-pointer">
                <div className={`gold-frame bg-card/70 backdrop-blur p-3 shadow-deep transition-all duration-700 hover:-translate-y-2 hover:shadow-gold ${isRevealed ? "opacity-100" : "opacity-25 grayscale"}`}>
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img src={c.img} alt={tt(i, "title")} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                </div>
                <div className={`px-3 pt-4 text-center transition-all duration-700 ${isRevealed ? "opacity-100" : "opacity-40"}`}>
                  <h3 className="font-display text-lg text-gold tracking-wide">{tt(i, "title")}</h3>
                  <p className="text-sm text-foreground/70 mt-1">{tt(i, "issuer")}</p>
                  <p className="text-xs text-primary/70 tracking-widest mt-2">{tt(i, "date")}</p>
                </div>
                {!isRevealed && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="font-display text-primary/80 text-xs tracking-widest">{t("cert.hidden")}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        </>
        )}
      </div>

      {open !== null && (
        <div onClick={() => setOpen(null)} className="fixed inset-0 z-[80] bg-background/95 backdrop-blur-md flex items-center justify-center p-6 reveal-up cursor-auto pointer-events-auto" data-cursor="native">
          <button className="absolute top-6 right-6 text-primary cursor-pointer" data-cursor="native"><X className="w-8 h-8" /></button>
          <div onClick={e => e.stopPropagation()} className="gold-frame p-3 bg-card max-w-4xl w-full cursor-auto" data-cursor="native">
            <img src={certs[open].img} alt={tt(open, "title")} className="w-full h-auto" />
            <div className="p-5 text-center">
              <h3 className="font-display text-2xl text-gold">{tt(open, "title")}</h3>
              <p className="text-foreground/70 mt-1">{tt(open, "issuer")} · {tt(open, "date")}</p>
              {certs[open].link !== "#" && (
                <a href={certs[open].link} target="_blank" rel="noopener noreferrer"
                   className="inline-block mt-4 px-6 py-2 border border-primary text-primary text-sm font-display tracking-widest hover:bg-primary hover:text-primary-foreground transition">
                  {t("cert.verify")}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
