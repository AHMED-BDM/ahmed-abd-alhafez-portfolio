import { useEffect, useState } from "react";

export const SarcasticWarning = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkSarcasm = () => {
      if (localStorage.getItem("sandstorm_torch") === "refused_first_time") {
        setTimeout(() => {
          setShow(true);
        }, 2500);
      }
    };
    checkSarcasm();
    window.addEventListener("torch_state_changed", checkSarcasm);
    return () => window.removeEventListener("torch_state_changed", checkSarcasm);
  }, []);

  const enableTorch = () => {
    localStorage.setItem("sandstorm_torch", "enabled");
    window.dispatchEvent(new Event("torch_state_changed"));
    setShow(false);
  };

  const sufferInDarkness = () => {
    localStorage.setItem("sandstorm_torch", "suffering");
    window.dispatchEvent(new Event("torch_state_changed"));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-stone-900/40 backdrop-blur-md px-4">
      <div className="bg-stone-950 border-2 border-primary/50 p-8 md:p-12 max-w-xl w-full text-center shadow-[0_0_60px_rgba(212,175,55,0.2)] rounded-lg relative overflow-hidden animate-in fade-in zoom-in duration-500">
        
        <div className="absolute inset-0 bg-orange-900/5 animate-pulse pointer-events-none" />
        
        <h2 className="font-display text-primary text-2xl md:text-4xl mb-6 tracking-[0.2em] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
          أيها الفاني المتهور!
        </h2>
        
        <p className="font-display text-primary/80 text-base md:text-lg leading-relaxed mb-10" dir="rtl">
          لقد حذرتك من غضب العاصفة الرملية، لكنك اخترت العناد. 
          الآن أنت تائه وسط الرمال، لا ترى طريقك ولن تنجو طويلاً في هذه الصحراء الملعونة.
          <br/><br/>
          سأعطيك فرصة أخيرة.. هل تريد إشعال الشعلة الآن، أم تفضل الضياع في العاصفة؟
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
          <button onClick={enableTorch} className="px-6 py-3 bg-stone-900 border-2 border-primary text-primary hover:bg-primary hover:text-black transition-all duration-300 font-display tracking-widest text-sm cursor-pointer">
            أشعل الشعلة
          </button>
          
          <button onClick={sufferInDarkness} className="px-6 py-3 bg-transparent border-2 border-primary/20 text-primary/40 hover:border-red-900 hover:text-red-600 transition-all duration-300 font-display tracking-widest text-sm cursor-pointer">
            سأواجه العاصفة وحدي
          </button>
        </div>
      </div>
    </div>
  );
};
