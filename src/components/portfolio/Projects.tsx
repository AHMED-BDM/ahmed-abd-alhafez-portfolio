import { useState } from "react";
import { SectionTitle } from "./About";
import p1 from "@/assets/project-fleet.png";
import p2 from "@/assets/project-hr-dashboard.png";
import p3 from "@/assets/project-sales.png";
import { ExternalLink, X } from "lucide-react";
import { Sarcophagus } from "./Sarcophagus";

const projects = [
  { img: p1, title: "Fleet Performance Dashboard", desc: "Interactive Power BI dashboard tracking fleet costs, distances and driver spending patterns with KPI cards.", tags: ["Power BI", "KPI", "Analytics"], link: "#" },
  { img: p2, title: "Employee Report & Workforce Analysis", desc: "HR analytics dashboard visualizing employee distribution by department, gender, country and salary brackets.", tags: ["Power BI", "HR Analytics", "BI"], link: "#" },
  { img: p3, title: "Sales Performance Dashboard", desc: "Global sales intelligence dashboard with profit margin gauges, geographic sales and category breakdowns.", tags: ["Power BI", "Sales", "Geo"], link: "#" },
];

export const Projects = () => {
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="projects" className="relative py-28 px-6 overflow-hidden">
      <div className="container max-w-7xl">
        <SectionTitle eyebrow="𓍢 · CHAPTER · IV" title="Treasure Chamber" />

        {!opened ? (
          <Sarcophagus label="𓊃 · ROYAL · TREASURE · CHAMBER · 𓊃" intensity="strong" onOpen={() => setOpened(true)} />
        ) : (
          <div className="grid md:grid-cols-3 gap-8 reveal-up">
            {projects.map((p, i) => (
              <div key={i}
                onClick={() => setActive(i)}
                className="group relative gold-frame bg-card/70 backdrop-blur shadow-deep cursor-pointer hover:-translate-y-2 hover:shadow-gold transition-all duration-500">
                <div className="aspect-video overflow-hidden">
                  <img src={p.img} alt={p.title} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-lg text-gold tracking-wide mb-2">{p.title}</h3>
                  <p className="text-sm text-foreground/80 mb-3 line-clamp-2">{p.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map(t => (
                      <span key={t} className="text-[10px] tracking-widest px-2 py-0.5 border border-primary/50 text-primary">{t.toUpperCase()}</span>
                    ))}
                  </div>
                </div>
                <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {active !== null && (
        <div onClick={() => setActive(null)} className="fixed inset-0 z-[80] bg-background/95 backdrop-blur-md flex items-center justify-center p-6 reveal-up">
          <button className="absolute top-6 right-6 text-primary"><X className="w-8 h-8" /></button>
          <div onClick={e => e.stopPropagation()} className="gold-frame p-3 bg-card max-w-5xl w-full">
            <img src={projects[active].img} alt={projects[active].title} className="w-full h-auto" />
            <div className="p-6">
              <h3 className="font-display text-2xl text-gold mb-2">{projects[active].title}</h3>
              <p className="text-foreground/80">{projects[active].desc}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
