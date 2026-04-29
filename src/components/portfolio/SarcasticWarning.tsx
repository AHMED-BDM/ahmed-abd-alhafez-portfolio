import { useEffect, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";

export const SarcasticWarning = () => {
  const [show, setShow] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    const checkSarcasm = () => {
      if (localStorage.getItem("sandstorm_torch") === "refused_first_time") {
        setTimeout(() => {
          setShow(true);
        }, 7000);
      }
    };
    
    checkSarcasm();
    window.addEventListener("torch_state_changed", checkSarcasm);
    return () => window.removeEventListener("torch_state_changed", checkSarcasm);
  }, []);

  const handleAction = (status: "enabled" | "suffering") => {
    localStorage.setItem("sandstorm_torch", status);
    window.dispatchEvent(new Event("torch_state_changed"));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/95 backdrop-blur-xl pointer-events-auto px-4">
      <div className="relative bg-stone-950 border-4 border-gold p-8 md:p-12 max-w-2xl w-full text-center shadow-[0_0_100px_rgba(212,175,55,0.6)] rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        
        {/* توهج داخلي */}
        <div className="absolute inset-0 bg-gradient-to-t from-gold/10 to-transparent animate-pulse pointer-events-none" />
        
        <div className="relative z-10">
          <span className="text-7xl block mb-4 text-gold drop-shadow-[0_0_20px_gold]">𓂀</span>
          
          <h2 className="font-display text-gold text-3xl md:text-5xl mb-6 tracking-wider drop-shadow-[0_0_15px_gold] leading-tight">
            {t("sarcastic.title")}
          </h2>
          
          <p className="text-gold/90 text-xl md:text-2xl leading-relaxed mb-8 font-serif drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]" dir="auto">
            {t("sarcastic.message")}
          </p>

          <p className="text-gold/80 text-lg italic mb-10">
            {t("sarcastic.offer")}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => handleAction("enabled")}
              className="px-8 py-3 bg-gold/20 border-2 border-gold text-gold font-display tracking-widest hover:bg-gold hover:text-black transition-all duration-300 shadow-gold rounded-lg text-base md:text-lg"
            >
              {t("sarcastic.accept")}
            </button>
            
            <button 
              onClick={() => handleAction("suffering")}
              className="px-8 py-3 bg-red-900/30 border-2 border-red-600 text-red-400 font-display tracking-widest hover:bg-red-800 hover:text-white transition-all duration-300 rounded-lg text-base md:text-lg"
            >
              {t("sarcastic.reject")}
            </button>
          </div>

          <p className="mt-10 text-[10px] tracking-[0.3em] text-gold/40">
            𓋴 𓎟 𓏙
          </p>
        </div>
      </div>
    </div>
  );
};
