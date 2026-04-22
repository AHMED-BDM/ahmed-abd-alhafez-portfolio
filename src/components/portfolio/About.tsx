export const About = () => (
  <section id="about" className="relative py-28 px-6">
    <div className="container max-w-5xl">
      <SectionTitle eyebrow="𓋴 · CHAPTER · I" title="The Scribe's Tale" />
      <div className="relative bg-stone gold-frame p-10 md:p-14 shadow-deep">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: "linear-gradient(transparent 95%, hsl(var(--primary)/0.4) 96%), linear-gradient(90deg, transparent 95%, hsl(var(--primary)/0.3) 96%)",
          backgroundSize: "40px 40px",
        }} />
        <p className="relative text-lg md:text-xl leading-relaxed text-foreground/90 first-letter:text-6xl first-letter:font-display first-letter:text-gold first-letter:mr-3 first-letter:float-left first-letter:leading-none">
          Machine Learning Engineer and Data Analyst with 1+ year of hands-on experience in AI, ML and Data Analytics.
          Trained under the Egyptian Ministry of Communications & Information Technology (MCIT) — Digilians initiative,
          mastering Python, SQL, R, Excel, Power BI and Tableau.
        </p>
        <p className="relative mt-6 text-lg leading-relaxed text-foreground/85">
          Delivered <span className="text-primary font-semibold">20+ projects</span> across predictive modeling,
          interactive dashboards, HR analytics and logistics intelligence. Holds
          <span className="text-primary font-semibold"> 12 professional certifications</span> including
          Google Data Analytics, IBM AI Fundamentals and Deep Learning for NLP — combining strong mathematical
          foundations with military-academy discipline.
        </p>

        <div className="relative grid grid-cols-3 gap-6 mt-10 text-center">
          {[
            { n: "20+", l: "Projects" },
            { n: "12", l: "Certificates" },
            { n: "9 mo", l: "MCIT Training" },
          ].map(s => (
            <div key={s.l} className="border-t-2 border-primary/40 pt-4">
              <div className="font-display text-3xl text-gold">{s.n}</div>
              <div className="text-xs tracking-widest text-foreground/60 mt-1">{s.l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const SectionTitle = ({ eyebrow, title }: { eyebrow: string; title: string }) => (
  <div className="text-center mb-14">
    <p className="font-display text-primary tracking-[0.4em] text-xs mb-3">{eyebrow}</p>
    <h2 className="font-display text-4xl md:text-6xl font-black text-gold">{title}</h2>
    <div className="mx-auto mt-4 h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent" />
  </div>
);
