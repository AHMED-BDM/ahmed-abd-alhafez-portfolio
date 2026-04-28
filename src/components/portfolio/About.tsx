import { useLang } from "@/i18n/LanguageContext";

export const SectionTitle = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <div className="text-center mb-14">
    <p className="font-display text-primary tracking-[0.4em] text-xs mb-3">{eyebrow}</p>
    <h2 className="font-display text-4xl md:text-6xl font-black text-gold">{title}</h2>
    <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent" />
  </div>
);

export const About = () => {
  const { t } = useLang();
  const stats = [
    { n: "20+", l: t("about.stat1") },
    { n: "12", l: t("about.stat2") },
    { n: "1+", l: t("about.stat3") }
  ];

  return (
    <section id="about" className="relative py-28 px-6">
      <div className="container max-w-5xl">
        <SectionTitle eyebrow={t("about.eyebrow")} title={t("about.title")} />
        <div className="relative bg-stone gold-frame p-10 md:p-14 shadow-deep">
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
            backgroundImage: "linear-gradient(transparent 95%, hsl(var(--primary)/0.4) 96%), linear-gradient(90deg, transparent 95%, hsl(var(--primary)/0.3) 96%)",
            backgroundSize: "40px 40px",
          }} />
          <p className="relative text-lg md:text-xl leading-relaxed text-foreground/90 first-letter:text-6xl first-letter:font-display first-letter:text-gold first-letter:mr-3 first-letter:float-left first-letter:leading-none">
            {t("about.content")}
          </p>

          <div className="relative grid grid-cols-3 gap-6 mt-10 text-center">
            {stats.map(s => (
              <div key={s.l} className="border-t-2 border-primary/40 pt-4">
                <div className="font-display text-3xl text-gold">{s.n}</div>
                <div className="text-xs tracking-widest text-foreground/60 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
