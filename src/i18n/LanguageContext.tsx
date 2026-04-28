import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type Lang = "en" | "ar";
type Dict = Record<string, { en: string; ar: string }>;

export const T: Dict = {
  // ---------- Navigation ----------
  "nav.about": { en: "About", ar: "عنوان" },
  "nav.skills": { en: "Skills", ar: "المهارات" },
  "nav.certificates": { en: "Certificates", ar: "الشهادات" },
  "nav.projects": { en: "Projects", ar: "المشاريع" },
  "nav.volunteering": { en: "Volunteering", ar: "التطوع" },
  "nav.contact": { en: "Contact", ar: "اتصل" },

  // ---------- Hero ----------
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

  // ---------- About (نص كامل) ----------
  "about.eyebrow": { en: "𓋴 THE SCRIBE'S IDENTITY", ar: "𓋴 هوية الكاتب" },
  "about.title": { en: "Who is Ahmed?", ar: "من هو أحمد؟" },
  "about.content": {
    en: "I am a Data Analyst and Machine Learning Engineer with over a year of hands-on experience in AI, ML, and data analytics. I completed a government-accredited training program under Egypt's Ministry of Communications (MCIT) through the Digilians initiative, mastering Python, SQL, R, Excel, Power BI, and Tableau. I deliver 20+ data projects spanning predictive modeling, interactive dashboards, HR analytics, and logistics intelligence. I hold 12 professional certifications including Google Data Analytics, IBM AI Fundamentals, and Deep Learning for NLP. My military academy discipline ensures reliable, high-quality analytical solutions on deadline.",
    ar: "أنا محلل بيانات ومهندس تعلم آلة، لدي أكثر من عام من الخبرة العملية في الذكاء الاصطناعي وتعلم الآلة وتحليل البيانات. أكملت برنامجاً تدريبياً معتمداً من الحكومة المصرية (وزارة الاتصالات) عبر مبادرة ديجيليانز، حيث أتقنت Python و SQL و R و Excel و Power BI و Tableau. أقدم أكثر من 20 مشروع بيانات تشمل النمذجة التنبؤية ولوحات المعلومات التفاعلية وتحليلات الموارد البشرية وذكاء الخدمات اللوجستية. أحمل 12 شهادة مهنية من بينها جوجل لتحليل البيانات وأساسيات الذكاء الاصطناعي من IBM والتعلم العميق للمعالجة اللغوية. انضباطي المستمد من الأكاديمية العسكرية يضمن حلولاً تحليلية عالية الجودة في الوقت المحدد."
  },
  "about.stat1": { en: "Data Projects", ar: "مشروع بيانات" },
  "about.stat2": { en: "Certifications", ar: "شهادة" },
  "about.stat3": { en: "Year Experience", ar: "عام خبرة" },

  // ---------- Skills ----------
  "skills.eyebrow": { en: "𓋹 SACRED ARTS", ar: "𓋹 الفنون المقدسة" },
  "skills.title": { en: "My Tools & Powers", ar: "أدواتي وقواي" },
  "skills.technical": { en: "Technical Skills", ar: "المهارات التقنية" },
  "skills.soft": { en: "Soft Skills", ar: "المهارات الشخصية" },
  "skills.tech_items": {
    en: "Python, SQL, R, Power BI, Tableau, Excel, Scikit-learn, TensorFlow, Streamlit",
    ar: "Python, SQL, R, Power BI, Tableau, Excel, Scikit-learn, TensorFlow, Streamlit"
  },
  "skills.soft_items": {
    en: "Analytical Thinking, Problem Solving, Team Collaboration, Time Management, Adaptability",
    ar: "التفكير التحليلي، حل المشكلات، العمل الجماعي، إدارة الوقت، التكيف"
  },

  // ---------- Certificates ----------
  "cert.eyebrow": { en: "𓂀 ROYAL SEALS", ar: "𓂀 الأختام الملكية" },
  "cert.title": { en: "Certifications", ar: "الشهادات" },
  "cert.list": {
    en: "• Google Data Analytics Professional Certificate (Coursera)\n• Diploma in Microsoft Power BI for Beginners (Alison)\n• Python Programming (Mahara-Tech)\n• Mathematics for Machine Learning (Udemy)\n• Deep Learning for NLP (Mahara-Tech)\n• Artificial Intelligence Fundamentals (IBM SkillsBuild)\n• Elements of AI (University of Helsinki)\n• Database Fundamentals (Mahara-Tech/ITI)\n• Project Management Foundation (LinkedIn Learning)\n• Decision Making in Business (Edraak)\n• Delivering Quality Work with Agility (IBM/Coursera)\n• Canva Essentials (Canva Design School)",
    ar: "• شهادة جوجل الاحترافية في تحليل البيانات (Coursera)\n• دبلوم مايكروسوفت Power BI للمبتدئين (Alison)\n• برمجة Python (Mahara-Tech)\n• رياضيات تعلم الآلة (Udemy)\n• تعلم عميق للمعالجة اللغوية (Mahara-Tech)\n• أساسيات الذكاء الاصطناعي (IBM SkillsBuild)\n• أساسيات الذكاء الاصطناعي (جامعة هلسنكي)\n• أساسيات قواعد البيانات (Mahara-Tech/ITI)\n• أساسيات إدارة المشاريع (LinkedIn Learning)\n• اتخاذ القرار في عالم الأعمال (Edraak)\n• تقديم عمل عالي الجودة بخفة الحركة (IBM/Coursera)\n• أساسيات كانفا (مدرسة كانفا للتصميم)"
  },

  // ---------- Projects ----------
  "projects.eyebrow": { en: "𓊽 MY MONUMENTS", ar: "𓊽 آثاري" },
  "projects.title": { en: "Featured Projects", ar: "المشاريع البارزة" },
  "projects.major": { en: "Major Project: Fleet Performance Dashboard", ar: "المشروع الرئيسي: لوحة أداء الأسطول" },
  "projects.major_desc": {
    en: "An interactive Power BI dashboard tracking fleet costs, travel distances, and spending patterns across drivers and vehicle models. Integrated KPI cards to support operational and financial decision-making.",
    ar: "لوحة تحكم تفاعلية باستخدام Power BI لتتبع تكاليف الأسطول ومسافات الرحلات وأنماط الإنفاق عبر السائقين وموديلات المركبات. تم دمج بطاقات مؤشرات الأداء الرئيسية لدعم القرارات التشغيلية والمالية."
  },
  "projects.other": {
    en: "• Employee Report Dashboard (Power BI – HR analytics)\n• Extra Bonus & Workforce Analysis (Excel – geographic insights)\n• Shipping & Invoice Analytics (Excel – logistics efficiency)\n• Fitness Performance AI Model (Python, Random Forest, XGBoost, Streamlit)\n• E-commerce Data Analytics (SQL, Power BI)",
    ar: "• لوحة تقارير الموظفين (Power BI – تحليلات الموارد البشرية)\n• تحليل المكافآت الإضافية والقوى العاملة (Excel – رؤى جغرافية)\n• تحليلات الشحن والفواتير (Excel – كفاءة الخدمات اللوجستية)\n• نموذج الذكاء الاصطناعي لأداء اللياقة البدنية (Python، Random Forest، XGBoost، Streamlit)\n• تحليل بيانات التجارة الإلكترونية (SQL، Power BI)"
  },

  // ---------- Volunteering ----------
  "vol.eyebrow": { en: "𓋴 VOLUNTEERING · TEAM LEADER", ar: "𓋴 التطوع · قائد فريق" },
  "vol.title": { en: "Leadership Chamber", ar: "حجرة القيادة" },
  "vol.solve": { en: "Tap the symbols in the sacred order to unlock the scrolls", ar: "اضغط على الرموز بالترتيب المقدس لفتح الأسفار" },
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

  // ---------- Contact ----------
  "contact.eyebrow": { en: "𓂀 SEND A SCROLL", ar: "𓂀 أرسل بردي" },
  "contact.title": { en: "Let's Talk", ar: "لنتحدث" },
  "contact.email": { en: "Email", ar: "البريد الإلكتروني" },
  "contact.linkedin": { en: "LinkedIn", ar: "لينكد إن" },
  "contact.github": { en: "GitHub", ar: "جيت هاب" },
  "contact.submit": { en: "SEAL & SEND", ar: "ختم وإرسال" },
  "contact.name_placeholder": { en: "Your name", ar: "اسمك" },
  "contact.message_placeholder": { en: "Your message...", ar: "رسالتك..." },

  // ---------- Hidden Chamber ----------
  "hidden.line1": { en: "You step into the darkness. The air is heavy with centuries.", ar: "تخطو في الظلام. الهواء ثقيل بقرون مضت." },
  "hidden.line2": { en: "A whisper comes from the walls: 'No one leaves without answering.'", ar: "همس يأتي من الجدران: 'لا أحد يغادر دون أن يجيب.'" },
  "hidden.line3": { en: "You see your reflection in an obsidian stone, but it smiles differently.", ar: "ترى انعكاسك في حجر سبج، لكنه يبتسم بشكل مختلف." },
  "hidden.line4": { en: "'The Pharaoh knows your deepest question.' The torch flickers.", ar: "'الفرعون يعرف أعمق أسئلتك.' الشعلة تتلألأ." },
  "hidden.line5": { en: "Suddenly, a scroll appears: 'Do not seek answers. Seek the right question.'", ar: "فجأة، يظهر بردية: 'لا تبحث عن إجابات. ابحث عن السؤال الصحيح.'" },
  "hidden.line6": { en: "The chamber shakes. A door opens to the Pharaoh's Chat. Enter if you dare.", ar: "الحجرة تهتز. باب يفتح على شات الفرعون. ادخل إن تجرأت." },

  // ---------- Pharaoh Chat ----------
  "chat.welcome": {
    en: "I knew you would come here... I saw your name on the tablet of fate 3,000 years ago.",
    ar: "كنت أعلم أنك ستأتي إلى هنا... لقد رأيت اسمك في لوحة الأقدار منذ 3000 سنة."
  },
  "chat.placeholder": { en: "Whisper your question to the Servant of Horus...", ar: "اهمس بسؤالك لخادم حورس..." },
  "chat.button": { en: "Send message", ar: "أرسل الرسالة" },

  // ---------- Generic ----------
  "gate.skip": { en: "SKIP THE RITUAL ›", ar: "تخطي الطقوس ›" },
  "mid.spirit": { en: "Data is the new papyrus · Insight is the new power", ar: "البيانات هي البردي الجديد · والرؤية هي القوة الجديدة" }
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
