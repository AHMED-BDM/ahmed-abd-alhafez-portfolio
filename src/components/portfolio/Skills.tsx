import { SectionTitle } from "./About";

const groups = [
  {
    title: "Data & Analysis",
    glyph: "𓎛",
    items: ["Power BI", "Tableau", "Excel", "SQL", "R", "Google Sheets", "Data Cleaning", "EDA", "ETL"],
  },
  {
    title: "Programming",
    glyph: "𓂀",
    items: ["Python", "SQL", "R", "Streamlit", "Jupyter", "VS Code", "Google Colab"],
  },
  {
    title: "Machine Learning & AI",
    glyph: "𓆣",
    items: ["Scikit-learn", "Random Forest", "XGBoost", "Neural Networks", "Deep Learning", "NLP", "Predictive Modeling"],
  },
];

export const Skills = () => (
  <section id="skills" className="relative py-28 px-6">
    <div className="container max-w-6xl">
      <SectionTitle eyebrow="𓊪 · CHAPTER · II" title="Sacred Crafts" />
      <div className="grid md:grid-cols-3 gap-8">
        {groups.map(g => (
          <div key={g.title} className="gold-frame bg-card/60 backdrop-blur-sm p-8 shadow-deep group hover:shadow-gold transition-all">
            <div className="text-6xl text-primary text-center torch-flicker mb-3">{g.glyph}</div>
            <h3 className="font-display text-xl tracking-widest text-gold text-center mb-6">{g.title.toUpperCase()}</h3>
            <ul className="space-y-2">
              {g.items.map(s => (
                <li key={s} className="flex items-center gap-3 text-foreground/85 hover:text-primary transition-colors group/item">
                  <span className="text-primary/70 group-hover/item:text-primary">✦</span>
                  <span className="font-serif text-lg">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </section>
);
