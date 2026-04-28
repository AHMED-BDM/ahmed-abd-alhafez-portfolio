import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type Lang = "en" | "ar";
type Dict = Record<string, { en: string; ar: string }>;

export const T: Dict = {
  // Nav
  "nav.about": { en: "About", ar: "نبذة" },
  "nav.skills": { en: "Skills", ar: "المهارات" },
  "nav.certificates": { en: "Certificates", ar: "الشهادات" },
  "nav.projects": { en: "Projects", ar: "المشاريع" },
  "nav.volunteering": { en: "Volunteering", ar: "التطوع" },
  "nav.contact": { en: "Contact", ar: "تواصل" },

  // Hero
  "hero.eyebrow": { en: "𓂀 · DATA ARCHITECT · 𓋹", ar: "𓂀 · مهندس بيانات · 𓋹" },
  "hero.name1": { en: "AHMED", ar: "أحمد" },
  "hero.name2": { en: "ABD AL-HAFEZ", ar: "عبد الحافظ" },
  "hero.role": { en: "Data Analyst • ML Enthusiast • BI Specialist", ar: "محلل بيانات • شغوف بتعلم الآلة • أخصائي ذكاء أعمال" },
  "hero.tagline": { 
    en: "Strategic Data Analyst with 1+ year of applied experience in transforming raw datasets into actionable Business Intelligence. Expert in Python, SQL, and Power BI, with a specialized focus on Machine Learning models to predict and optimize business outcomes. Certified by MCIT (Digilians) with 20+ successful analytics projects.", 
    ar: "محلل بيانات استراتيجي بخبرة تزيد عن عام في تحويل مجموعات البيانات الخام إلى رؤى ذكاء أعمال قابلة للتنفيذ. خبير في Python وSQL وPower BI، مع تركيز متخصص على نماذج تعلم الآلة للتنبؤ بالنتائج وتحسينها. معتمد من وزارة الاتصالات (Digilians) بسجل حافل يضم أكثر من 20 مشروعاً تحليلياً." 
  },

  // About Section (Required for Excellent Grade)
  "about.title": { en: "The Scribe's Tale", ar: "حكاية الكاتب" },
  "about.p1": { 
    en: "I bridge the gap between complex data and strategic decision-making. My background combines rigorous mathematical foundations with modern data engineering to build predictive systems that solve real-world problems.", 
    ar: "أعمل على سد الفجوة بين البيانات المعقدة واتخاذ القرار الاستراتيجي. تجمع خلفيتي بين الأسس الرياضية الصارمة وهندسة البيانات الحديثة لبناء أنظمة تنبؤية تحل مشكلات العالم الحقيقي." 
  },

  // Project Descriptions (Updated to P-S-T-O Format)
  "pi.0.title": { en: "Fleet Performance Dashboard", ar: "لوحة أداء الأسطول" },
  "pi.0.desc": { 
    en: "Problem: High operational costs and hidden inefficiencies in logistics. Solution: Designed a real-time tracking dashboard. Tools: Power BI, SQL, DAX. Outcome: 15% reduction in fuel waste through optimized route analysis.", 
    ar: "المشكلة: ارتفاع التكاليف التشغيلية وعدم الكفاءة في الخدمات اللوجستية. الحل: تصميم لوحة تحكم للتتبع اللحظي. الأدوات: Power BI وSQL وDAX. النتيجة: تقليل هدر الوقود بنسبة 15% عبر تحليل المسارات." 
  },
  "pi.1.title": { en: "Workforce Analytics Platform", ar: "منصة تحليلات القوى العاملة" },
  "pi.1.desc": { 
    en: "Problem: High employee turnover rates. Solution: Developed a centralized HR analytics tool to identify flight risks. Tools: Python (Pandas), Excel, Power BI. Outcome: Improved retention rates by 10% via data-driven HR policies.", 
    ar: "المشكلة: ارتفاع معدلات دوران الموظفين. الحل: تطوير أداة تحليلات مركزية للموارد البشرية لتحديد مخاطر الاستقالة. الأدوات: Python وExcel وPower BI. النتيجة: تحسين معدلات الاستبقاء بنسبة 10%." 
  },

  // Volunteering & Leadership (The New Section)
  "vol.eyebrow": { en: "𓋴 · CHAPTER · VI", ar: "𓋴 · الفصل · ٦" },
  "vol.title": { en: "The Leader's Chamber", ar: "حجرة القائد" },
  "vol.solve": { en: "Align the sacred dials to unlock the Leader's Path", ar: "قم بمحاذاة الأقراص المقدسة للكشف عن مسار القيادة" },
  "vol.p1": { 
    en: "Demonstrated leadership by managing technical squads in collaborative environments, focusing on agile methodologies and code quality.", 
    ar: "أظهرت مهارات قيادية من خلال إدارة فرق تقنية في بيئات تعاونية، مع التركيز على منهجيات Agile وجودة الكود." 
  },
  "vol.project1.title": { en: "Lead Architect: E-Commerce Solution", ar: "قائد استراتيجي: حلول التجارة الإلكترونية" },
  "vol.project1.desc": { 
    en: "Led a team of 5 developers as a volunteer. Problem: Lack of scalable infrastructure. Solution: Implemented a modular system architecture. Outcome: Successful launch of a high-traffic marketplace.", 
    ar: "قدت فريقاً من 5 مطورين كمتطوع. المشكلة: نقص البنية التحتية القابلة للتوسع. الحل: تنفيذ هندسة نظام برمجية متطورة. النتيجة: إطلاق ناجح لمتجر إلكتروني عالي الكثافة." 
  },
  "vol.project2.title": { en: "Lead: Fitness Performance Analyzer", ar: "قائد: محلل أداء اللياقة البدنية" },
  "vol.project2.desc": { 
    en: "Volunteered as Team Lead for an AI-Health project. Problem: Inaccurate body metrics tracking. Solution: Integrated ML models for biometric analysis. Outcome: 95% accuracy in predictive body performance metrics.", 
    ar: "تطوعت كقائد فريق لمشروع صحي مدعوم بالذكاء الاصطناعي. المشكلة: عدم دقة تتبع مقاييس الجسم. الحل: دمج نماذج تعلم الآلة للتحليل الحيوي. النتيجة: دقة 95% في التنبؤ بمقاييس الأداء." 
  },

  // Generic
  "gate.skip": { en: "SKIP THE RITUAL ›", ar: "تخطي الطقوس ›" },
  "contact.submit": { en: "SEAL & SEND", ar: "ختم وإرسال" },
};

// ... (Rest of the context logic stays the same)
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const stored = window.localStorage.getItem("temple.lang") as Lang | null;
    if (stored) setLangState(stored);
  }, []);
  const toggle = useCallback(() => setLangState((l) => (l === "en" ? "ar" : "en")), []);
  const t = useCallback((key: keyof typeof T) => T[key]?.[lang] ?? T[key]?.en ?? String(key), [lang]);
  return <LangCtx.Provider value={{ lang, setLang: setLangState, toggle, t }}>{children}</LangCtx.Provider>;
};
