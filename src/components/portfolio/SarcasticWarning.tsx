import { useEffect, useState } from "react";

export const SarcasticWarning = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // نراقب حالة الكشاف من التخزين المحلي
    const checkSarcasm = () => {
      if (localStorage.getItem("sandstorm_torch") === "refused_first_time") {
        // نؤخر ظهور الرسالة 3 ثواني عشان المستخدم يتوه في العتمة شوية ويحس بالرعب!
        setTimeout(() => {
          setShow(true);
        }, 3000);
      }
    };

    // فحص مبدئي
    checkSarcasm();
    
    // استماع لأي تغيير في حالة الكشاف
    window.addEventListener("torch_state_changed", checkSarcasm);
    return () => window.removeEventListener("torch_state_changed", checkSarcasm);
  }, []);

  const enableTorch = () => {
    localStorage.setItem("sandstorm_torch", "enabled");
    window.dispatchEvent(new Event("torch_state_changed"));
    setShow(false);
  };

  const sufferInDarkness = () => {
    // إذا رفض مجدداً، سيتم تسجيل الحالة لمعاناته الأبدية في العاصفة
    localStorage.setItem("sandstorm_torch", "suffering");
    window.dispatchEvent(new Event("torch_state_changed"));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md px-4">
      <div className="bg-stone-950 border-2 border-red-900/50 p-8 md:p-12 max-w-xl w-full text-center shadow-[0_0_60px_rgba(150,0,0,0.3)] rounded-lg relative overflow-hidden reveal-up">
        
        {/* تأثير إضاءة حمراء مرعبة في الخلفية */}
        <div className="absolute inset-0 bg-red-900/10 animate-pulse pointer-events-none" />
        
        <h2 className="font-display text-red-600 text-3xl md:text-5xl mb-6 tracking-[0.2em] drop-shadow-[0_0_15px_rgba(255,0,0,0.6)]">
          أحمــق!
        </h2>
        
        <p className="font-display text-primary/80 text-lg md:text-xl leading-relaxed mb-10" dir="rtl">
          لقد حذرتك من غضب العاصفة الرملية، لكنك اخترت العناد. 
          الآن أنت أعمى وسط الرمال، لا ترى شيئاً ولن تنجو طويلاً في هذه الصحراء الملعونة.
          <br/><br/>
          سأعطيك فرصة أخيرة.. هل تريد إشعال الشعلة الآن لترى طريقك، أم تفضل الموت في الظلام؟
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
          <button 
            onClick={enableTorch}
            className="px-6 py-3 bg-stone-900 border-2 border-primary text-primary hover:bg-primary hover:text-black hover:shadow-[0_0_20px_var(--primary)] transition-all duration-300 font-display tracking-widest text-sm md:text-base cursor-pointer"
          >
            أشعل الشعلة (موافقة)
          </button>
          
          <button 
            onClick={sufferInDarkness}
            className="px-6 py-3 bg-red-950/20 border-2 border-red-900 text-red-600 hover:bg-red-900 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all duration-300 font-display tracking-widest text-sm md:text-base cursor-pointer"
          >
            سأعاني في الظلام (رفض تام)
          </button>
        </div>
      </div>
    </div>
  );
};
