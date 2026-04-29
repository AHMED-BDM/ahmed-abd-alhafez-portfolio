import { useEffect, useState } from "react";

export const SarcasticWarning = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const checkSarcasm = () => {
      // نتحقق إذا كان المستخدم في حالة "رفض أول مرة"
      if (localStorage.getItem("sandstorm_torch") === "refused_first_time") {
        setTimeout(() => {
          setShow(true);
        }, 1500); // تظهر بعد ثانية ونصف من دخول العاصفة
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
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
      <div className="bg-stone-950 border-2 border-primary p-8 md:p-12 max-w-xl w-full text-center shadow-[0_0_100px_rgba(212,175,55,0.4)] rounded-2xl relative overflow-hidden animate-in fade-in zoom-in duration-500">
        
        {/* توهج داخلي */}
        <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none" />
        
        <h2 className="font-display text-primary text-2xl md:text-4xl mb-6 tracking-[0.1em] leading-tight">
          أيها الفاني المتهور!
        </h2>
        
        <p className="font-display text-primary/90 text-lg leading-relaxed mb-10" dir="rtl">
          لقد حذرتك من غضب العاصفة الرملية، لكنك اخترت العناد. 
          الآن أنت تائه وسط الرمال، لا ترى طريقك ولن تنجو طويلاً في هذه الصحراء الملعونة.
          <br/><br/>
          سأعطيك فرصة أخيرة.. هل تريد إشعال الشعلة الآن، أم تفضل الضياع في العاصفة؟
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
          <button 
            onClick={() => handleAction("enabled")}
            className="px-8 py-3 bg-primary text-black font-bold rounded-full hover:scale-105 transition-transform cursor-pointer"
          >
            أشعل الشعلة
          </button>
          
          <button 
            onClick={() => handleAction("suffering")}
            className="px-8 py-3 bg-transparent border border-primary/30 text-primary/60 hover:text-red-500 hover:border-red-500 transition-all cursor-pointer"
          >
            سأواجه العاصفة وحدي
          </button>
        </div>
      </div>
    </div>
  );
};
