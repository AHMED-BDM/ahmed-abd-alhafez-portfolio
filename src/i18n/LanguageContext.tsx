import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type Lang = "en" | "ar";
type Dict = Record<string, { en: string; ar: string }>;

export const T: Dict = {
  // -------------------- Navigation (Section Titles) --------------------
  "nav.about": { en: "About", ar: "عنوان" },
  "nav.skills": { en: "Skills", ar: "المهارات" },
  "nav.certificates": { en: "Certificates", ar: "الشهادات" },
  "nav.projects": { en: "Projects", ar: "المشاريع" },
  "nav.volunteering": { en: "Volunteering", ar: "التطوع" },
  "nav.contact": { en: "Contact", ar: "اتصل" },

  // -------------------- Hero Section --------------------
  "hero.eyebrow": { en: "𓂀 DATA ANALYST & ML ENGINEER", ar: "𓂀 محلل بيانات ومهندس تعلم آلة" },
  "hero.name1": { en: "AHMED", ar: "أحمد" },
  "hero.name2": { en: "ABD AL-HAFEZ", ar: "عبد الحافظ" },
  "hero.role": { en: "Data Analyst | Machine Learning Engineer", ar: "محلل بيانات | مهندس تعلم آلة" },
  "hero.tagline": {
    en: "I turn raw data into clear insights. With 20+ projects in predictive modeling, dashboards, and BI, I help build decisions on solid ground.",
    ar: "أحول البيانات الخام إلى رؤى واضحة. من خلال أكثر من 20 مشروعاً في النمذجة التنبؤية ولوحات المعلومات وذكاء الأعمال، أساعد في بناء القرارات على أرض صلبة."
  },
  "hero.cta1": { en: "Enter the Chamber", ar: "ادخل الحجرة" },
  "hero.cta2": { en: "See My Work", ar: "اطلع على أعمالي" },

  // -------------------- About Section (Based on CV) --------------------
  "about.eyebrow": { en: "𓋴 THE SCRIBE'S IDENTITY", ar: "𓋴 هوية الكاتب" },
  "about.title": { en: "Who is Ahmed?", ar: "من هو أحمد؟" },
  "about.p1": {
    en: "I am a Data Analyst and Machine Learning Engineer with over a year of hands-on experience in AI, ML, and data analytics. I completed a government-accredited training program under Egypt's Ministry of Communications (MCIT) through the Digilians initiative, mastering Python, SQL, R, Excel, Power BI, and Tableau.",
    ar: "أنا محلل بيانات ومهندس تعلم آلة، لدي أكثر من عام من الخبرة العملية في الذكاء الاصطناعي وتعلم الآلة وتحليل البيانات. أكملت برنامجاً تدريبياً معتمداً من الحكومة المصرية (وزارة الاتصالات) عبر مبادرة ديجيليانز، حيث أتقنت Python و SQL و R و Excel و Power BI و Tableau."
  },
  "about.p2_a": {
    en: "I deliver ",
    ar: "أقدم "
  },
  "about.p2_b": {
    en: "20+ data projects",
    ar: "أكثر من 20 مشروع بيانات"
  },
  "about.p2_c": {
    en: " spanning predictive modeling, interactive dashboards, HR analytics, and logistics intelligence. I hold ",
    ar: " تشمل النمذجة التنبؤية ولوحات المعلومات التفاعلية وتحليلات الموارد البشرية وذكاء الخدمات اللوجستية. أحمل "
  },
  "about.p2_d": {
    en: "12 professional certifications",
    ar: "12 شهادة مهنية"
  },
  "about.p2_e": {
    en: " including Google Data Analytics, IBM AI Fundamentals, and Deep Learning for NLP. My military academy discipline ensures reliable, high-quality analytical solutions on deadline.",
    ar: " من بينها جوجل لتحليل البيانات وأساسيات الذكاء الاصطناعي من IBM والتعلم العميق للمعالجة اللغوية. انضباطي المستمد من الأكاديمية العسكرية يضمن حلولاً تحليلية عالية الجودة في الوقت المحدد."
  },
  // Statistics
  "about.stat1": { en: "Data Projects", ar: "مشروع بيانات" },
  "about.stat2": { en: "Certifications", ar: "شهادة" },
  "about.stat3_n": { en: "1+", ar: "١+" },
  "about.stat3": { en: "Year Experience", ar: "عام خبرة" },

  // -------------------- Volunteering Section (Team Leader projects) --------------------
  "vol.eyebrow": { en: "𓋴 VOLUNTEERING · TEAM LEADER", ar: "𓋴 التطوع · قائد فريق" },
  "vol.title": { en: "Leadership Chamber", ar: "حجرة القيادة" },
  "vol.solve": {
    en: "Tap the symbols in the sacred order to unlock the scrolls",
    ar: "اضغط على الرموز بالترتيب المقدس لفتح الأسفار"
  },
  "vol.project1.title": { en: "E-commerce Data Analytics (Team Lead)", ar: "تحليل بيانات التجارة الإلكترونية (قائد فريق)" },
  "vol.project1.desc": {
    en: "Led a team of 3 volunteers to analyze 50K sales records. Cleaned data with Python (pandas), built an interactive Power BI dashboard that increased marketing ROI by 12%, and presented insights to stakeholders.",
    ar: "قادت فريقاً من 3 متطوعين لتحليل 50 ألف سجل مبيعات. قمنا بتنظيف البيانات باستخدام Python، وبناء لوحة تحكم تفاعلية باستخدام Power BI زادت عائد التسويق بنسبة 12%، وقدمنا التوصيات لأصحاب القرار."
  },
  "vol.project1.tools": { en: "Python (pandas, matplotlib), SQL, Power BI, Excel", ar: "Python (pandas, matplotlib), SQL, Power BI, Excel" },
  "vol.project2.title": { en: "Fitness Body Performance Analysis (Team Lead)", ar: "تحليل أداء اللياقة البدنية (قائد فريق)" },
  "vol.project2.desc": {
    en: "Led 4 volunteers to build a machine learning model (Random Forest, XGBoost, Neural Networks) predicting athletic performance from body metrics. Achieved 86% accuracy and deployed via Streamlit for coaches.",
    ar: "قادت 4 متطوعين لبناء نموذج تعلم آلة (Random Forest، XGBoost، شبكات عصبية) للتنبؤ بالأداء الرياضي من القياسات الجسمانية. حققنا دقة 86% ووفرنا النموذج عبر تطبيق Streamlit ليستخدمه المدربون."
  },
  "vol.project2.tools": { en: "Python (scikit-learn, TensorFlow), Streamlit, Pandas, NumPy", ar: "Python (scikit-learn, TensorFlow), Streamlit, Pandas, NumPy" },
  "vol.closing": {
    en: "These projects strengthened my technical leadership, teamwork, and ability to translate user needs into practical AI solutions. If you wish to learn more, head to the Sacred Chamber of Discourse (Pharaoh Chat).",
    ar: "هذان المشروعان عززا مهاراتي في القيادة التقنية والعمل الجماعي وقدرتي على ترجمة احتياجات المستخدم إلى حلول عملية بالذكاء الاصطناعي. إذا أردت معرفة المزيد، فتوجه إلى غرفة الأحاديث المقدسة (شات الفرعون)."
  },

  // -------------------- Hidden Chamber (6 scary lines) --------------------
  "hidden.line1": { en: "You step into the darkness. The air is heavy with centuries.", ar: "تخطو في الظلام. الهواء ثقيل بقرون مضت." },
  "hidden.line2": { en: "A whisper comes from the walls: 'No one leaves without answering.'", ar: "همس يأتي من الجدران: 'لا أحد يغادر دون أن يجيب.'" },
  "hidden.line3": { en: "You see your reflection in an obsidian stone, but it smiles differently.", ar: "ترى انعكاسك في حجر سبج، لكنه يبتسم بشكل مختلف." },
  "hidden.line4": { en: "'The Pharaoh knows your deepest question.' The torch flickers.", ar: "'الفرعون يعرف أعمق أسئلتك.' الشعلة تتلألأ." },
  "hidden.line5": { en: "Suddenly, a scroll appears: 'Do not seek answers. Seek the right question.'", ar: "فجأة، يظهر بردية: 'لا تبحث عن إجابات. ابحث عن السؤال الصحيح.'" },
  "hidden.line6": { en: "The chamber shakes. A door opens to the Pharaoh's Chat. Enter if you dare.", ar: "الحجرة تهتز. باب يفتح على شات الفرعون. ادخل إن تجرأت." },

  // -------------------- Pharaoh Chat --------------------
  "chat.welcome": {
    en: "I knew you would come here... I saw your name on the tablet of fate 3,000 years ago.",
    ar: "كنت أعلم أنك ستأتي إلى هنا... لقد رأيت اسمك في لوحة الأقدار منذ 3000 سنة."
  },
  "chat.warning": {
    en: "Beware, seeker. Every question you ask stirs the sands of the underworld.",
    ar: "احذر أيها الباحث. كل سؤال تسأله يحرك رمال العالم السفلي."
  },
  "chat.placeholder": { en: "Whisper your question to the Servant of Horus...", ar: "اهمس بسؤالك لخادم حورس..." },
  "chat.button": { en: "Send message", ar: "أرسل الرسالة" },

  // -------------------- Generic --------------------
  "gate.skip": { en: "SKIP THE RITUAL ›", ar: "تخطي الطقوس ›" },
  "contact.submit": { en: "SEAL & SEND", ar: "ختم وإرسال" },
  "mid.spirit": { en: "Data is the new papyrus · Insight is the new power", ar: "البيانات هي البردي الجديد · والرؤية هي القوة الجديدة" },
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
