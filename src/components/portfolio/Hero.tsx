import heroNight from "@/assets/hero-temple-night.jpg";
import heroDay from "@/assets/hero-temple-day.jpg";
import profile from "@/assets/profile-pharaoh.png";

export const Hero = ({ mode }: { mode: "night" | "day" }) => (
  <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
    <img
      src={mode === "night" ? heroNight : heroDay}
      alt="Ancient Egyptian temple"
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
      width={1920} height={1280}
    />
    <div className="absolute inset-0 bg-background/55" />

    <div className="relative z-10 container grid md:grid-cols-2 gap-12 items-center py-20">
      <div className="reveal-up">
        <p className="font-display text-primary tracking-[0.5em] text-xs mb-6">𓂀 · WELCOME · TRAVELER · 𓋹</p>
        <h1 className="font-display text-5xl md:text-7xl font-black leading-[1.05] mb-6">
          <span className="text-gold block">AHMED</span>
          <span className="text-gold block">ABD AL-HAFEZ</span>
        </h1>
        <p className="text-xl md:text-2xl text-foreground/90 italic mb-3 max-w-xl">
          Machine Learning Engineer · Data Analyst · AI Specialist
        </p>
        <p className="text-foreground/70 max-w-lg mb-10">
          Decoding the hieroglyphs of modern data. 20+ projects across predictive modeling,
          interactive dashboards and AI — forged with military discipline.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="#about"
            className="group relative px-8 py-3 font-display tracking-widest text-sm bg-primary text-primary-foreground gold-frame hover:shadow-gold transition-all">
            EXPLORE THE TEMPLE
          </a>
          <a href="#projects"
            className="px-8 py-3 font-display tracking-widest text-sm border-2 border-primary/50 text-primary hover:bg-primary/10 transition-all">
            VIEW MY WORK
          </a>
        </div>
      </div>

      <div className="relative flex justify-center reveal-up" style={{ animationDelay: "0.3s" }}>
        <div className="absolute inset-0 rounded-full blur-3xl bg-primary/30 float-slow" />
        <div className="relative gold-frame p-3 bg-card/40 backdrop-blur-sm rounded-md float-slow">
          <img src={profile} alt="Pharaonic portrait of Ahmed" className="w-72 md:w-96 h-auto" width={384} height={384} />
        </div>
      </div>
    </div>

    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary text-2xl torch-flicker">𓂀</div>
  </section>
);
