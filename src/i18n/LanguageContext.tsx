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
  "nav.github": { en: "GitHub", ar: "جيت هاب" },

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

  // ---------- About ----------
  "about.eyebrow": { en: "𓋴 THE SCRIBE'S IDENTITY", ar: "𓋴 هوية الكاتب" },
  "about.title": { en: "Who is Ahmed?", ar: "من هو أحمد؟" },
  "about.content": {
    en: "I am a Data Analyst and Machine Learning Engineer with over a year of hands-on experience in AI, ML, and data analytics. I completed a government-accredited training program under Egypt's Ministry of Communications (MCIT) through the Digilians initiative, mastering Python, SQL, R, Excel, Power BI, and Tableau. I deliver 20+ data projects spanning predictive modeling, interactive dashboards, HR analytics, and logistics intelligence. I hold 12 professional certifications including Google Data Analytics, IBM AI Fundamentals, and Deep Learning for NLP. My military academy discipline ensures reliable, high-quality analytical solutions on deadline.",
    ar: "أنا محلل بيانات ومهندس تعلم آلة، لدي أكثر من عام من الخبرة العملية في الذكاء الاصطناعي وتعلم الآلة وتحليل البيانات. أكملت برنامجاً تدريبياً معتمداً من الحكومة المصرية (وزارة الاتصالات) عبر مبادرة الرواد الرقميون (Digilians)، حيث أتقنت Python و SQL و R و Excel و Power BI و Tableau. أقدم أكثر من 20 مشروع بيانات تشمل النمذجة التنبؤية ولوحات المعلومات التفاعلية وتحليلات الموارد البشرية وذكاء الخدمات اللوجستية. أحمل 12 شهادة مهنية من بينها جوجل لتحليل البيانات وأساسيات الذكاء الاصطناعي من IBM والتعلم العميق للمعالجة اللغوية. انضباطي المستمد من الأكاديمية العسكرية يضمن حلولاً تحليلية عالية الجودة في الوقت المحدد."
  },
  "about.stat1": { en: "Data Projects", ar: "مشروع بيانات" },
  "about.stat2": { en: "Certifications", ar: "شهادة" },
  "about.stat3": { en: "Year Experience", ar: "عام خبرة" },

  // ---------- Skills ----------
  "skills.eyebrow": { en: "𓋹 SACRED ARTS", ar: "𓋹 الفنون المقدسة" },
  "skills.title": { en: "My Tools & Powers", ar: "أدواتي وقواي" },
  "skills.g1": { en: "Data Analytics", ar: "تحليل البيانات" },
  "skills.g2": { en: "Development Tools", ar: "أدوات التطوير" },
  "skills.g3": { en: "AI & Machine Learning", ar: "الذكاء الاصطناعي وتعلم الآلة" },

  // ---------- Projects ----------
  "proj.eyebrow": { en: "𓊽 MY MONUMENTS", ar: "𓊽 آثاري" },
  "proj.title": { en: "Featured Projects", ar: "المشاريع البارزة" },
  "proj.sealLabel": { en: "BREAK THE SEAL", ar: "اكسر الختم" },
  "pi.0.title": { en: "Fleet Performance Dashboard", ar: "لوحة أداء الأسطول" },
  "pi.0.desc": { en: "Interactive Power BI dashboard tracking fleet costs, travel distances, and spending patterns. Integrated KPI cards for operational decisions.", ar: "لوحة تحكم تفاعلية باستخدام Power BI لتتبع تكاليف الأسطول ومسافات الرحلات وأنماط الإنفاق. تم دمج بطاقات مؤشرات الأداء الرئيسية لدعم القرارات التشغيلية." },
  "pi.1.title": { en: "Employee Report Dashboard", ar: "لوحة تقارير الموظفين" },
  "pi.1.desc": { en: "Comprehensive HR analytics dashboard visualizing employee distribution by center, department, and salary bracket. Enabled workforce trend analysis.", ar: "لوحة تحكم شاملة لتحليلات الموارد البشرية تعرض توزيع الموظفين حسب المركز والإدارة وشريحة الراتب. تمكين تحليل اتجاهات القوى العاملة." },
  "pi.2.title": { en: "Sales Performance Dashboard", ar: "لوحة أداء المبيعات" },
  "pi.2.desc": { en: "Interactive sales analytics with geographic insights, product category performance, and time-series trends to optimize revenue.", ar: "تحليلات مبيعات تفاعلية مع رؤى جغرافية، أداء فئات المنتجات، واتجاهات زمنية لتحسين الإيرادات." },
  "pi.3.title": { en: "Extra Bonus & Workforce Analysis", ar: "تحليل المكافآت الإضافية والقوى العاملة" },
  "pi.3.desc": { en: "Multi-sheet Excel dashboard analyzing employee demographics, salary trends, bonus distribution across multiple countries.", ar: "لوحة تحكم متعددة الأوراق في Excel تحلل التركيبة السكانية للموظفين، اتجاهات الرواتب، توزيع المكافآت عبر عدة دول." },
  "pi.4.title": { en: "Shipping & Invoice Analytics", ar: "تحليلات الشحن والفواتير" },
  "pi.4.desc": { en: "European shipping performance tracker monitoring invoices, shipment status, and logistics efficiency by country and product category.", ar: "متتبع أداء الشحن الأوروبي يراقب الفواتير وحالة الشحن وكفاءة الخدمات اللوجستية حسب البلد وفئة المنتج." },
  "pi.5.title": { en: "Fitness Performance AI Model", ar: "نموذج الذكاء الاصطناعي لأداء اللياقة" },
  "pi.5.desc": { en: "AI-powered fitness analysis using Random Forest, XGBoost, and Neural Networks to predict athletic performance and generate training recommendations.", ar: "تحليل لياقة بدنية مدعوم بالذكاء الاصطناعي باستخدام Random Forest و XGBoost والشبكات العصبية للتنبؤ بالأداء الرياضي وتوليد توصيات تدريبية." },

  // ---------- Certificates ----------
  "cert.eyebrow": { en: "𓂀 ROYAL SEALS", ar: "𓂀 الأختام الملكية" },
  "cert.title": { en: "Certifications", ar: "الشهادات" },
  "cert.sealLabel": { en: "UNSEAL THE CHAMBER", ar: "افتح الحجرة" },
  "cert.intro": { en: "Hover over each seal to reveal the sacred certifications earned from international institutions.", ar: "مرر فوق كل ختم لكشف الشهادات المقدسة التي حصلت عليها من مؤسسات دولية." },
  "cert.hidden": { en: "𓋴 HIDDEN 𓋴", ar: "𓋴 مخفي 𓋴" },
  "cert.verify": { en: "VERIFY", ar: "تحقق" },
  "ci.0.title": { en: "Google Data Analytics", ar: "جوجل لتحليل البيانات" },
  "ci.0.issuer": { en: "Google (Coursera)", ar: "جوجل (كورسيرا)" },
  "ci.0.date": { en: "2025", ar: "٢٠٢٥" },
  "ci.1.title": { en: "IBM AI Fundamentals", ar: "أساسيات الذكاء الاصطناعي من IBM" },
  "ci.1.issuer": { en: "IBM SkillsBuild", ar: "IBM SkillsBuild" },
  "ci.1.date": { en: "2025", ar: "٢٠٢٥" },
  "ci.2.title": { en: "Deep Learning for NLP", ar: "التعلم العميق للمعالجة اللغوية" },
  "ci.2.issuer": { en: "Mahara-Tech", ar: "مهارة تك" },
  "ci.2.date": { en: "2025", ar: "٢٠٢٥" },
  "ci.3.title": { en: "Decision Making in Business", ar: "اتخاذ القرار في عالم الأعمال" },
  "ci.3.issuer": { en: "Edraak", ar: "إدراك" },
  "ci.3.date": { en: "2024", ar: "٢٠٢٤" },
  "ci.4.title": { en: "Canva Essentials", ar: "أساسيات كانفا" },
  "ci.4.issuer": { en: "Canva Design School", ar: "مدرسة كانفا للتصميم" },
  "ci.4.date": { en: "2024", ar: "٢٠٢٤" },
  "ci.5.title": { en: "Microsoft Power BI DAX", ar: "مايكروسوفت Power BI DAX" },
  "ci.5.issuer": { en: "Microsoft / Alison", ar: "مايكروسوفت / أليسون" },
  "ci.5.date": { en: "2025", ar: "٢٠٢٥" },

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
  "contact.send": { en: "Send a Message", ar: "أرسل رسالة" },
  "contact.name": { en: "Your name", ar: "اسمك" },
  "contact.email": { en: "Your email", ar: "بريدك الإلكتروني" },
  "contact.message": { en: "Your message", ar: "رسالتك" },
  "contact.direct": { en: "Direct Contact", ar: "اتصال مباشر" },
  "contact.location": { en: "Cairo, Egypt", ar: "القاهرة، مصر" },
  "contact.toast": { en: "Message sealed and sent!", ar: "تم ختم الرسالة وإرسالها!" },
  "contact.footer": { en: "All monuments are forged by the scribe of data.", ar: "جميع الآثار صُنعت على يد كاتب البيانات." },
  "contact.submit": { en: "SEAL & SEND", ar: "ختم وإرسال" },

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

  // ---------- Sandstorm Warning (العاصفة الرملية) ----------
  "sandstorm.title": {
    en: "𓂀 THE CURSE OF THE SANDSTORM 𓂀",
    ar: "𓂀 لعنة العاصفة الرملية 𓂀"
  },
  "sandstorm.message": {
    en: "You have entered the realm of the Day... the desert spirits are furious. A mighty sandstorm has been unleashed upon your path. You cannot see clearly... unless you move the sacred torch (your mouse cursor). Let its glow pierce the dust, or you shall wander blind. Do you accept this trial?",
    ar: "لقد دخلت نطاق النهار... أرواح الصحراء غاضبة. عاصفة رملية هائلة أُطلقت على دربك. لا ترى بوضوح... إلا إذا حركت الشعلة المقدسة (مؤشر فأرتك). دع توهجها يخترق الغبار، وإلا ستظل تائهًا. أتقبل هذه المحنة؟"
  },
  "sandstorm.button": {
    en: "I accept and proceed",
    ar: "أقبل وأمضي"
  },

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

  // 🔹 ضبط اتجاه الصفحة واللغة عند تغيير اللغة
  useEffect(() => {
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

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
