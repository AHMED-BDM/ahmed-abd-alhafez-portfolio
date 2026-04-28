import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type Lang = "en" | "ar";
type Dict = Record<string, { en: string; ar: string }>;

export const T: Dict = {
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
    en: "Strategic Data Analyst with 1+ year of applied experience. Expert in SQL, Python, and Power BI, focusing on Machine Learning to drive data-driven decision making. Certified by MCIT (Digilians).", 
    ar: "محلل بيانات استراتيجي بخبرة تزيد عن عام. خبير في SQL وPython وPower BI، مع تركيز على تعلم الآلة لدعم اتخاذ القرار. معتمد من وزارة الاتصالات (Digilians)." 
  },
  "hero.cta1": { en: "The Scribe's Tale", ar: "حكاية الكاتب" },
  "hero.cta2": { en: "View Projects", ar: "عرض المشاريع" },

  // VisionZone (Middle Page)
  "mid.spirit": { en: "𓋹 THE SCRIBE'S ANCIENT VISION 𓋹", ar: "𓋹 رؤية الكاتب الأزلية 𓋹" },

  // Projects (P-S-T-O Format)
  "pi.0.title": { en: "Fleet Performance Dashboard", ar: "لوحة أداء الأسطول" },
  "pi.0.desc": { en: "Problem: Logistics inefficiency. Solution: Real-time BI dashboard. Tools: SQL, Power BI. Outcome: 15% fuel waste reduction.", ar: "المشكلة: عدم كفاءة اللوجستيات. الحل: لوحة ذكاء أعمال لحظية. الأدوات: SQL و Power BI. النتيجة: تقليل هدر الوقود بنسبة 15%." },
  
  // Volunteering
  "vol.eyebrow": { en: "𓋴 · CHAPTER · VI", ar: "𓋴 · الفصل · ٦" },
  "vol.title": { en: "The Leader's Chamber", ar: "حجرة القائد" },
  "vol.solve": { en: "Align the sacred dials to unlock the Leader's Path", ar: "قم بمحاذاة الأقراص المقدسة للكشف عن مسار القيادة" },
};

const LangCtx = createContext<any>(null);
export const useLang = () => useContext(LangCtx);
export const LanguageProvider = ({ children }: { ReactNode }) => {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const stored = window.localStorage.getItem("temple.lang") as Lang;
    if (stored) setLangState(stored);
  }, []);
  const toggle = useCallback(() => {
    const next = lang === "en" ? "ar" : "en";
    setLangState(next);
    window.localStorage.setItem("temple.lang", next);
  }, [lang]);
  const t = (key: string) => T[key]?.[lang] ?? T[key]?.en ?? key;
  return <LangCtx.Provider value={{ lang, toggle, t }}>{children}</LangCtx.Provider>;
};
