import { useEffect, useState } from "react";

export const SarcasticWarning = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkSarcasm = () => {
      // نتحقق إذا كان المستخدم في حالة "رفض أول مرة"
      if (localStorage.getItem("sandstorm_torch") === "refused_first_time") {
        setTimeout(() => {
          setShow(true);
        }, 7000); // تظهر بعد 7 ثوان من دخول العاصفة
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
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/90 backdrop-blur-md px-4">
      <div className="bg-stone-950/95 border-4 border-gold p-8 md:p-12 max-w-2xl w-full text-center shadow-[0_0_120px_rgba(255,215,0,0.5)] rounded-2xl relative overflow-hidden animate-in fade-in zoom-in duration-500">
        
        {/* توهج داخلي ذهبي */}
        <div className="absolute inset-0 bg-gold/5 animate-pulse pointer-events-none" />
        
        {/* أيقونة مخيفة */}
        <div className="text-7xl mb-4 animate-pulse text-gold drop-shadow-[0_0_15px_gold]">𓂀</div>
        
        <h2 className="font-display text-3xl md:text-5xl text-gold mb-6 tracking-[0.1em] leading-tight drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
          ⚠️ أيها الفاني المتهور! ⚠️
        </h2>
        
        <div className="w-24 h-px bg-gold/50 mx-auto my-4" />
        
        <p className="font-serif text-xl md:text-2xl text-gold/90 leading-relaxed mb-8 drop-shadow-[0_0_5px_rgba(255,215,0,0.5)]" dir="rtl">
          لقد حذرتك من غضب العاصفة الرملية، لكنك اخترت العناد. 
          <br/><br/>
          الآن أنت تائه وسط الرمال، لا ترى طريقك ولن تنجو طويلاً في هذه الصحراء الملعونة.
          <br/><br/>
          <span className="text-gold text-2xl font-bold drop-shadow-[0_0_8px_gold]">سأعطيك فرصة أخيرة..</span> هل تريد إشعال الشعلة الآن، أم تفضل الضياع في العاصفة؟
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10 mt-6">
          <button 
            onClick={() => handleAction("enabled")}
            className="px-8 py-4 bg-gold text-black font-bold text-lg rounded-full hover:scale-105 hover:shadow-[0_0_25px_rgba(255,215,0,0.8)] transition-all duration-300 cursor-pointer"
          >
            🔥 أشعل الشعلة 🔥
          </button>
          
          <button 
            onClick={() => handleAction("suffering")}
            className="px-8 py-4 bg-transparent border-2 border-red-600 text-red-500 hover:text-red-400 hover:border-red-500 hover:bg-red-950/30 transition-all duration-300 rounded-full text-lg font-bold cursor-pointer"
          >
            💀 سأواجه العاصفة وحدي 💀
          </button>
        </div>
        
        <p className="mt-8 text-[10px] tracking-[0.3em] text-gold/40">
          𓋴 𓎟 𓏙
        </p>
      </div>
    </div>
  );
};
