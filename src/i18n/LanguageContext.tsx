import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type Lang = "en" | "ar";
type Dict = Record<string, { en: string; ar: string }>;

export const T: Dict = {
  // Navigation
  "nav.about": { en: "About", ar: "نبذة" },
  "nav.skills": { en: "Skills", ar: "المهارات" },
  "nav.certificates": { en: "Certificates", ar: "الشهادات" },
  "nav.projects": { en: "Projects", ar: "المشاريع" },
  "nav.volunteering": { en: "Volunteering", ar: "التطوع" },
  "nav.contact": { en: "Contact", ar: "تواصل" },

  // Hero Section
  "hero.eyebrow": { en: "𓂀 · DATA ARCHITECT · 𓋹", ar: "𓂀 · مهندس بيانات · 𓋹" },
  "hero.name1": { en: "AHMED", ar: "أحمد" },
  "hero.name2": { en: "ABD AL-HAFEZ", ar: "عبد الحافظ" },
  "hero.role": { en: "Data Analyst • ML Enthusiast • BI Specialist", ar: "محلل بيانات • شغوف بتعلم الآلة • أخصائي ذكاء أعمال" },
  "hero.tagline": { 
    en: "Strategic Data Analyst with 1+ year of applied experience. Expert in SQL, Python, and Power BI. Certified by MCIT (Digilians) with 20+ successful projects.", 
    ar: "محلل بيانات استراتيجي بخبرة تزيد عن عام. خبير في SQL وPython وPower BI. معتمد من وزارة الاتصالات (Digilians) بأكثر من 20 مشروعاً." 
  },
  "hero.cta1": { en: "The Scribe's Tale", ar: "حكاية الكاتب" },
  "hero.cta2": { en: "View Projects", ar: "عرض المشاريع" },

  // VisionZone (The Middle Image Section)
  "mid.spirit": { en: "𓋹 THE SCRIBE'S ANCIENT VISION 𓋹", ar: "𓋹 رؤية الكاتب الأزلية 𓋹" },

  // About Section
  "about.title": { en: "The Scribe's Tale", ar: "حكاية الكاتب" },
  "about.p1": { 
    en: "I bridge the gap between complex data and strategic decision-making using rigorous mathematical foundations.", 
    ar: "أعمل على سد الفجوة بين البيانات المعقدة واتخاذ القرار الاستراتيجي باستخدام الأسس الرياضية الصارمة." 
  },

  // Project Descriptions
  "pi.0.title": { en: "Fleet Performance Dashboard", ar: "لوحة أداء الأسطول" },
  "pi.0.desc": { en: "Problem: Logistics inefficiency. Solution: Real-time BI dashboard. Outcome: 15% fuel waste reduction.", ar: "المشكلة: عدم كفاءة اللوجستيات. الحل: لوحة ذكاء أعمال لحظية. النتيجة: تقليل هدر الوقود بنسبة 15%." },

  // Volunteering & Leadership
  "vol.eyebrow": { en: "𓋴 · CHAPTER · VI", ar: "𓋴 · الفصل · ٦" },
  "vol.title": { en: "The Leader's Chamber", ar: "حجرة القائد" },
  "vol.solve": { en: "Align the sacred dials to unlock the Leader's Path", ar: "قم بمحاذاة الأقراص المقدسة للكشف عن مسار القيادة" },

  // Generic
  "gate.skip": { en: "SKIP THE RITUAL ›", ar: "تخطي الطقوس ›" },
  "contact.submit": { en: "SEAL & SEND", ar: "ختم وإرسال" },
};

const LangCtx = createContext<any>(null);

// ✅ التصدير الصحيح للـ Hook لضمان عدم حدوث Circular Import
export const useLang = () => {
  const context = useContext(LangCtx);
  if (!context) throw new Error("useLang must be used within LanguageProvider");
  return context;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("temple.lang") as Lang | null;
    if (stored) setLangState(stored);
  }, []);

  const toggle = useCallback(() => {
    const nextMode = lang === "en" ? "ar" : "en";
    setLangState(nextMode);
    window.localStorage.setItem("temple.lang", nextMode);
  }, [lang]);

  const t = useCallback((key: keyof typeof T) => {
    return T[key]?.[lang] ?? T[key]?.en ?? String(key);
  }, [lang]);

  return (
    <LangCtx.Provider value={{ lang, toggle, t }}>
      {children}
    </LangCtx.Provider>
  );
};
