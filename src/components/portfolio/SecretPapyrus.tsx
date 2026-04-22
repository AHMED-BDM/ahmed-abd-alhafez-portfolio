import { useState } from "react";
import { X } from "lucide-react";
import { useSound } from "./SoundContext";

export const SecretPapyrus = () => {
  const [open, setOpen] = useState(false);
  const { play } = useSound();

  return (
    <>
      {/* Hidden hieroglyph trigger — bottom-left tile */}
      <button
        onClick={() => { play("open"); setOpen(true); }}
        onMouseEnter={() => play("hover")}
        aria-label="Reveal hidden papyrus"
        className="fixed bottom-4 left-4 z-[55] w-8 h-8 flex items-center justify-center text-primary/40 hover:text-primary hover:scale-125 transition-all text-2xl"
        style={{ textShadow: "0 0 8px hsl(var(--primary)/0.6)" }}
      >
        𓊽
      </button>

      {open && (
        <div onClick={() => setOpen(false)}
          className="fixed inset-0 z-[95] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 animate-[fadeIn_0.4s_ease-out]">
          <button className="absolute top-6 right-6 text-primary z-10" aria-label="Close">
            <X className="w-8 h-8" />
          </button>
          {/* dust particles */}
          {Array.from({ length: 18 }).map((_, i) => (
            <span key={i} className="absolute w-1 h-1 rounded-full bg-primary/70"
              style={{
                left: `${Math.random()*100}%`, top: `${Math.random()*100}%`,
                animation: `float 5s ease-in-out ${Math.random()*3}s infinite`,
              }} />
          ))}

          <div onClick={e => e.stopPropagation()}
            className="relative max-w-3xl w-full origin-center"
            style={{ animation: "scrollUnroll 0.9s cubic-bezier(0.65,0,0.35,1) forwards" }}>
            <div className="bg-papyrus rounded-sm shadow-deep p-8 md:p-12 text-stone-900"
              style={{ color: "hsl(25 50% 18%)" }}>
              <div className="border-y-2 border-amber-900/40 py-3 mb-6 text-center">
                <p className="font-display tracking-[0.4em] text-amber-900 text-xs">𓋹 · ANCIENT · SCROLL · 𓂀</p>
                <h3 className="font-display text-3xl md:text-4xl mt-2" style={{ color: "hsl(28 70% 25%)" }}>
                  Curriculum Vitae
                </h3>
              </div>
              <div className="space-y-4 leading-relaxed font-serif">
                <p><strong>Ahmed Abd Al-Hafez</strong> — Machine Learning Engineer · Data Analyst · AI Specialist</p>
                <p>1+ year of hands-on experience in AI, ML and Data Analytics. Trained under MCIT Digilians initiative — mastering Python, SQL, R, Excel, Power BI and Tableau.</p>
                <p><strong>Highlights:</strong> 20+ projects · 12 professional certifications · Google Data Analytics · IBM AI Fundamentals · Deep Learning for NLP.</p>
                <p><strong>Skills:</strong> Predictive Modeling · Interactive Dashboards · HR & Logistics Analytics · NLP · BI Engineering.</p>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a href="/Ahmed_Abd_Al-Hafez_CV.docx" download
                  className="px-6 py-2 bg-amber-900 text-amber-50 font-display tracking-widest text-sm hover:bg-amber-800 transition">
                  ⬇ DOWNLOAD FULL CV
                </a>
              </div>
              <p className="mt-6 text-center text-xs italic text-amber-900/70">— sealed within the temple walls —</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};