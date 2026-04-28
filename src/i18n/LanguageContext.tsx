import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type Lang = "en" | "ar";
type Dict = Record<string, { en: string; ar: string }>;

export const T: Dict = {
  // Navigation - الملاحة بالألقاب الفرعونية
  "nav.about": { en: "The Scribe", ar: "الكاتب" },
  "nav.skills": { en: "Sacred Arts", ar: "الفنون المقدسة" },
  "nav.certificates": { en: "Royal Seals", ar: "الأختام الملكية" },
  "nav.projects": { en: "Monuments", ar: "الآثار" },
  "nav.volunteering": { en: "The Chamber", ar: "الحجرة" },
  "nav.contact": { en: "Ritual", ar: "الطقوس" },

  // Hero Section - هيبة الواجهة
  "hero.eyebrow": { en: "𓂀 · GRAND ARCHITECT OF DATA · 𓋹", ar: "𓂀 · كبير مهندسي البيانات · 𓋹" },
  "hero.name1": { en: "AHMED", ar: "أحمد" },
  "hero.name2": { en: "ABD AL-HAFEZ", ar: "عبد الحافظ" },
  "hero.role": { en: "Data Alchemist • ML High Priest • BI Sage", ar: "خيميائي البيانات • كاهن تعلم الآلة • حكيم ذكاء الأعمال" },
  "hero.tagline": { 
    en: "Transforming chaotic sands of data into golden insights. Certified by the Great Scribes of MCIT, wielding Python and SQL to predict the future of empires.", 
    ar: "تحويل رمال البيانات العشوائية إلى رؤى ذهبية. معتمد من كبار كتبة وزارة الاتصالات، أسخر سحر Python وSQL للتنبؤ بمستقبل الإمبراطوريات." 
  },
  "hero.cta1": { en: "Enter The Tomb", ar: "ادخل المقبرة" },
  "hero.cta2": { en: "See The Legacy", ar: "شاهد الإرث" },

  // VisionZone - رؤية المنتصف
  "mid.spirit": { en: "𓋹 THE SCRIBE'S ANCIENT VISION 𓋹", ar: "𓋹 رؤية الكاتب الأزلية 𓋹" },

  // Volunteering Section - وصف مشاريع القيادة (تيم ليدر)
  "vol.eyebrow": { en: "𓋴 · CHAPTER · VI", ar: "𓋴 · الفصل · ٦" },
  "vol.title": { en: "The Leader's Chamber", ar: "حجرة القائد" },
  "vol.solve": { en: "Align the sacred dials to unlock the Leader's Path", ar: "قم بمحاذاة الأقراص المقدسة للكشف عن مسار القيادة" },
  "vol.p1": { 
    en: "Even in the shadows of the pyramids, a leader must guide the workers. I led squads of creators to build digital monuments that defy time.", 
    ar: "حتى في ظلال الأهرامات، يجب على القائد توجيه العمال. قدت فصائل من المبدعين لبناء صروح رقمية تتحدى الزمن." 
  },
  "vol.project1.title": { en: "Supreme Lead: E-Commerce Expedition", ar: "القائد الأعلى: بعثة التجارة الإلكترونية" },
  "vol.project1.desc": { 
    en: "Led a legion of 5 developers to construct a marketplace empire. Orchestrated the architecture and solved complex riddles of scalability, resulting in a flawless deployment under the desert sun.", 
    ar: "قدت فيلقاً من 5 مطورين لبناء إمبراطورية تجارية. نسقت هندسة النظام وحللت ألغاز التوسع المعقدة، مما أدى لإطلاق ناجح تحت شمس الصحراء." 
  },
  "vol.project2.title": { en: "Chief Architect: AI-Health Oracle", ar: "كبير المهندسين: عرافة الصحة الذكية" },
  "vol.project2.desc": { 
    en: "Guided a specialized team as Team Lead in an AI-Health ritual. Integrated Machine Learning spells to track the vital signs of the living, achieving 95% accuracy in predicting biometric fates.", 
    ar: "وجهت فريقاً متخصصاً كقائد لمشروع الصحة والذكاء الاصطناعي. دمجت تعاويذ تعلم الآلة لتتبع العلامات الحيوية، محققاً دقة 95% في التنبؤ بمصائر الأجساد." 
  },

  // Pharaoh Chat - استعادة الجمل المرعبة
  "chat.welcome": { 
    en: "I knew you would speak to me... the sands whispered your arrival.", 
    ar: "كنت أعلم أنك ستتحدث معي... لقد همست الرمال بقدومك." 
  },
  "chat.warning": { 
    en: "Beware, traveler. Every question has a price in the afterlife.", 
    ar: "احذر أيها المسافر. فكل سؤال له ثمن في الحياة الأخرى." 
  },
  "chat.placeholder": { en: "Whisper your query...", ar: "اهمس بسؤالك..." },

  // Generic
  "gate.skip": { en: "SKIP THE RITUAL ›", ar: "تخطي الطقوس ›" },
  "contact.submit": { en: "SEAL & SEND", ar: "ختم وإرسال" },
};

const LangCtx = createContext<any>(null);

// تصدير الـ Hook بشكل صحيح لتجنب Circular Import
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
