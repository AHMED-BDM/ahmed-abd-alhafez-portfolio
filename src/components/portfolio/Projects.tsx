import { useState } from "react";
import { SectionTitle } from "./About";
import p1 from "@/assets/project-fleet.png";
import p2 from "@/assets/project-hr-dashboard.png";
import p3 from "@/assets/project-sales.png";
import p4 from "@/assets/project-employee-report.png";
import p5 from "@/assets/project-shipping.png";
import p6 from "@/assets/project-neural-body.png";
import { ExternalLink, X } from "lucide-react";
import { Sarcophagus } from "./Sarcophagus";
import { useLang } from "@/i18n/LanguageContext";

const projects = [
  { img: p1, tags: ["Power BI", "KPI", "Analytics"], link: "#" },
  { img: p2, tags: ["Power BI", "HR Analytics", "BI"], link: "#" },
  { img: p3, tags: ["Power BI", "Sales", "Geo"], link: "#" },
  { img: p4, tags: ["Power BI", "HR", "Dashboard"], link: "#" },
  { img: p5, tags: ["Power BI", "Logistics", "DAX"], link: "#" },
  { img: p6, tags: ["AI", "React", "Biometrics"], link: "#" },
];

export const Projects = () => {
  const { t } = useLang();
  const [opened, setOpened] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const tt = (i: number, k: "title" | "desc") => t(`pi.${i}.${k}` as any);

  return (
    <section id="projects" className="relative py-28 px-6 overflow-hidden">
      <div className="container max-w-7xl">
        <SectionTitle eyebrow={t("proj.eyebrow")} title={t("proj.title")} />

        {!opened ? (
          <Sarcophagus label={t("proj.sealLabel")} intensity="strong" onOpen={() => setOpened(true)} />
        ) : (
          <div className="grid md:grid-cols-3 gap-8 reveal-up">
            {projects.map((p, i) => (
              <div key={i}
                onClick={() => setActive(i)}
                className="group relative cursor-pointer hover:-translate-y-2 transition-all duration-500">
                <div className="gold-frame bg-card/70 backdrop-blur shadow-deep overflow-hidden hover:shadow-gold transition-all duration-500">
                  <div className="aspect-video overflow-hidden">
                    <img src={p.img} alt={tt(i, "title")} loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                </div>
                <div className="px-2 pt-4">
                  <h3 className="font-display text-lg text-gold tracking-wide mb-2">{tt(i, "title")}</h3>
                  <p className="text-sm text-foreground/80 mb-3 line-clamp-2">{tt(i, "desc")}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map(tag => (
                      <span key={tag} className="text-[10px] tracking-widest px-2 py-0.5 border border-primary/50 text-primary">{tag.toUpperCase()}</span>
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
        <div onClick={() => setActive(null)} className="fixed inset-0 z-[80] bg-background/95 backdrop-blur-md flex items-center justify-center p-6 reveal-up cursor-auto pointer-events-auto" data-cursor="native">
          <button className="absolute top-6 right-6 text-primary cursor-pointer" data-cursor="native"><X className="w-8 h-8" /></button>
          <div onClick={e => e.stopPropagation()} className="gold-frame p-3 bg-card max-w-5xl w-full cursor-auto" data-cursor="native">
            <img src={projects[active].img} alt={tt(active, "title")} className="w-full h-auto" />
            <div className="p-6">
              <h3 className="font-display text-2xl text-gold mb-2">{tt(active, "title")}</h3>
              <p className="text-foreground/80">{tt(active, "desc")}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
