import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type Lang = "en" | "ar";
type Dict = Record<string, { en: string; ar: string }>;

export const T: Dict = {
  // -------------------- Navigation (الملاحة) --------------------
  "nav.about": { en: "The Analyst", ar: "المحلل" },
  "nav.skills": { en: "Tools of the Trade", ar: "أدوات المهنة" },
  "nav.certificates": { en: "Honors & Seals", ar: "الأوسمة والأختام" },
  "nav.projects": { en: "Data Monuments", ar: "آثار البيانات" },
  "nav.volunteering": { en: "Leadership Chamber", ar: "حجرة القيادة" },
  "nav.contact": { en: "Send a Scroll", ar: "أرسل بردي" },

  // -------------------- Hero Section --------------------
  "hero.eyebrow": { en: "𓂀 · DATA ANALYST & ML ENGINEER · 𓋹", ar: "𓂀 · محلل بيانات ومهندس تعلم آلة · 𓋹" },
  "hero.name1": { en: "AHMED", ar: "أحمد" },
  "hero.name2": { en: "ABD AL-HAFEZ", ar: "عبد الحافظ" },
  "hero.role": { en: "Data Analyst | Machine Learning Engineer", ar: "محلل بيانات | مهندس تعلم آلة" },
  "hero.tagline": {
    en: "I turn raw data into clear insights. With 20+ projects in predictive modeling, dashboards, and BI, I help build decisions on solid ground.",
    ar: "أحول البيانات الخام إلى رؤى واضحة. من خلال أكثر من 20 مشروعاً في النمذجة التنبؤية، ولوحات المعلومات، وذكاء الأعمال، أساعد في بناء القرارات على أرض صلبة."
  },
  "hero.cta1": { en: "Enter the Chamber", ar: "ادخل الحجرة" },
  "hero.cta2": { en: "See My Work", ar: "اطلع على أعمالي" },

  // -------------------- Vision / Mid Section --------------------
  "mid.spirit": { en: "𓋹 Data is the new papyrus · Insight is the new power 𓋹", ar: "𓋹 البيانات هي البردي الجديد · والرؤية هي القوة الجديدة 𓋹" },

  // -------------------- Volunteering Section (Leader's Chamber) --------------------
  "vol.eyebrow": { en: "𓋴 · VOLUNTEERING · TEAM LEADER", ar: "𓋴 · التطوع · قائد فريق" },
  "vol.title": { en: "The Leader's Chamber", ar: "حجرة القائد" },
  "vol.solve": {
    en: "Align the sacred symbols to unlock the scrolls of leadership",
    ar: "قم بمحاذاة الرموز المقدسة لفتح أسفار القيادة"
  },
  // المشروع الأول للتطوع
  "vol.project1.title": { en: "E-commerce Data Analytics (Team Lead)", ar: "تحليل بيانات التجارة الإلكترونية (قائد فريق)" },
  "vol.project1.desc": {
    en: "Led a team of 3 volunteers to analyze 50K sales records, cleaned data with Python, built an interactive Power BI dashboard that increased marketing ROI by 12%, and presented insights to stakeholders.",
    ar: "قادت فريقاً من 3 متطوعين لتحليل 50 ألف سجل مبيعات، قمنا بتنظيف البيانات باستخدام Python، وبناء لوحة تحكم تفاعلية باستخدام Power BI زادت عائد التسويق بنسبة 12%، وقدمنا التوصيات لأصحاب القرار."
  },
  "vol.project1.tools": { en: "Python (pandas, matplotlib), SQL, Power BI, Excel", ar: "Python (pandas, matplotlib), SQL, Power BI, Excel" },
  // المشروع الثاني للتطوع
  "vol.project2.title": { en: "Fitness Body Performance Analysis (Team Lead)", ar: "تحليل أداء اللياقة البدنية (قائد فريق)" },
  "vol.project2.desc": {
    en: "Led 4 volunteers to build a machine learning model (Random Forest, XGBoost, Neural Networks) predicting athletic performance from body metrics. Achieved 86% accuracy and deployed via Streamlit for coaches to use.",
    ar: "قادت 4 متطوعين لبناء نموذج تعلم آلة (Random Forest، XGBoost، شبكات عصبية) للتنبؤ بالأداء الرياضي من القياسات الجسمانية. حققنا دقة 86% ووفرنا النموذج عبر تطبيق Streamlit ليستخدمه المدربون."
  },
  "vol.project2.tools": { en: "Python (scikit-learn, TensorFlow), Streamlit, Pandas, NumPy", ar: "Python (scikit-learn, TensorFlow), Streamlit, Pandas, NumPy" },
  "vol.closing": {
    en: "These projects strengthened my technical leadership, teamwork, and ability to translate user needs into practical AI solutions. If you wish to learn more, head to the Sacred Chamber of Discourse (Pharaoh Chat).",
    ar: "هذان المشروعان عززا مهاراتي في القيادة التقنية، والعمل الجماعي، وقدرتي على ترجمة احتياجات المستخدم إلى حلول عملية بالذكاء الاصطناعي. إذا أردت معرفة المزيد، فتوجه إلى غرفة الأحاديث المقدسة (شات الفرعون)."
  },

  // -------------------- Pharaoh Chat (الغرفة السرية / الشات) --------------------
  // ستُستخدم هذه المفاتيح في ملفي HiddenChamber و PharaohChat لاحقاً
  "chat.welcome": {
    en: "I knew you would come here... I saw your name on the tablet of fate 3,000 years ago.",
    ar: "كنت أعلم أنك ستأتي إلى هنا... لقد رأيت اسمك في لوحة الأقدار منذ 3000 سنة."
  },
  "chat.warning": {
    en: "Beware, seeker. Every question you ask stirs the sands of the underworld.",
    ar: "احذر أيها الباحث. كل سؤال تسأله يحرك رمال العالم السفلي."
  },
  "chat.placeholder": { en: "Whisper your question to the servant of Horus...", ar: "اهمس بسؤالك لخادم حورس..." },
  "chat.button": { en: "Send message", ar: "أرسل الرسالة" },

  // -------------------- الغرفة السرية (Hidden Chamber - 6 أسطر مخيفة) --------------------
  "hidden.line1": { en: "You step into the darkness. The air is heavy with centuries.", ar: "تخطو في الظلام. الهواء ثقيل بقرون مضت." },
  "hidden.line2": { en: "A whisper comes from the walls: 'No one leaves without answering.'", ar: "همس يأتي من الجدران: 'لا أحد يغادر دون أن يجيب.'" },
  "hidden.line3": { en: "You see your reflection in an obsidian stone, but it smiles differently.", ar: "ترى انعكاسك في حجر سبج، لكنه يبتسم بشكل مختلف." },
  "hidden.line4": { en: "'The Pharaoh knows your deepest question.' The torch flickers.", ar: "'الفرعون يعرف أعمق أسئلتك.' الشعلة تتلألأ." },
  "hidden.line5": { en: "Suddenly, a scroll appears: 'Do not seek answers. Seek the right question.'", ar: "فجأة، يظهر بردية: 'لا تبحث عن إجابات. ابحث عن السؤال الصحيح.'" },
  "hidden.line6": { en: "The chamber shakes. A door opens to the Pharaoh's Chat. Enter if you dare.", ar: "الحجرة تهتز. باب يفتح على شات الفرعون. ادخل إن تجرأت." },

  // -------------------- باقي المفاتيح القديمة أو العامة --------------------
  "gate.skip": { en: "SKIP THE RITUAL ›", ar: "تخطي الطقوس ›" },
  "contact.submit": { en: "SEAL & SEND", ar: "ختم وإرسال" },
};

const LangCtx = createContext<any>(null);

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
