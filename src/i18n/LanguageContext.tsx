import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type Lang = "en" | "ar";

type Dict = Record<string, { en: string; ar: string }>;

export const T: Dict = {
  // Nav
  "nav.about": { en: "About", ar: "نبذة" },
  "nav.skills": { en: "Skills", ar: "المهارات" },
  "nav.certificates": { en: "Certificates", ar: "الشهادات" },
  "nav.projects": { en: "Projects", ar: "المشاريع" },
  "nav.github": { en: "GitHub", ar: "جيت هب" },
  "nav.contact": { en: "Contact", ar: "تواصل" },

  // Controls
  "controls.enableSound": { en: "ENABLE SOUND", ar: "تفعيل الصوت" },
  "controls.mute": { en: "MUTE", ar: "كتم" },
  "controls.unmute": { en: "UNMUTE", ar: "تشغيل" },
  "controls.immersive": { en: "IMMERSIVE", ar: "غامر" },
  "controls.subtle": { en: "SUBTLE", ar: "خفيف" },
  "controls.lang": { en: "العربية", ar: "ENGLISH" },

  // Github dashboard
  "gh.chapter": { en: "𓊪 · CHAPTER · V", ar: "𓊪 · الفصل · ٥" },
  "gh.title": { en: "Royal Developer Codex", ar: "سجل المطور الملكي" },
  "gh.loading": { en: "Decoding the codex...", ar: "فك رموز السجل..." },
  "gh.error": { en: "Could not summon the codex from Octocat —", ar: "تعذر استدعاء السجل من الإله Octocat —" },
  "gh.bioFallback": { en: "Scribe of code in the digital temple", ar: "كاتب نقوش الكود في المعبد الرقمي" },
  "gh.langs": { en: "𓎛 · INSCRIPTION LANGUAGES · 𓎛", ar: "𓎛 · لغات النقوش · 𓎛" },
  "gh.digital": { en: "𓂀 · DIGITAL GLYPHS · 𓂀", ar: "𓂀 · نقوش رقمية · 𓂀" },
  "gh.repos": { en: "REPOS", ar: "المستودعات" },
  "gh.stars": { en: "STARS", ar: "النجوم" },
  "gh.forks": { en: "FORKS", ar: "التفرعات" },
  "gh.followers": { en: "FOLLOWERS", ar: "المتابعون" },
  "gh.following": { en: "FOLLOWING", ar: "يتابع" },
  "gh.publicRepos": { en: "PUBLIC REPOS", ar: "المستودعات العامة" },
  "gh.languages": { en: "LANGUAGES", ar: "اللغات" },
  "gh.descFallback": { en: "A mysterious inscription from the developer's archive...", ar: "نقش غامض من سجل المطور..." },
  "gh.modalDescFallback": { en: "An inscription without description — enter the temple to discover it.", ar: "نقش بلا وصف — ادخل المعبد لاكتشافه." },
  "gh.updated": { en: "UPDATED", ar: "آخر تحديث" },

  // Fourth wall
  "fw.return1": { en: "You returned again...", ar: "عدت مرة أخرى..." },
  "fw.return2": { en: "You're late...", ar: "لقد تأخرت..." },
  "fw.return3": { en: "I was waiting for you.", ar: "كنت أنتظرك." },
  "fw.long1": { en: "You've stayed too long...", ar: "لقد بقيت طويلاً..." },
  "fw.long2": { en: "Why do you watch this place?", ar: "لماذا تراقب هذا المكان؟" },
  "fw.s4_1": { en: "I see you.", ar: "أراك." },
  "fw.s4_2": { en: "You cannot leave.", ar: "لا تستطيع المغادرة." },

  // Pharaoh chat
  "chat.greet": { en: "*I knew you would speak to me.*", ar: "*كنت أعلم أنك ستتحدث معي.*" },

  // Hidden chamber
  "hc.label": { en: "𓋹 HIDDEN CHAMBER 𓋹", ar: "𓋹 الحجرة السرية 𓋹" },
  "hc.title": { en: "A Secret Forged in Silence", ar: "سرٌّ صيغ في الصمت" },
  "hc.body": {
    en: "\"Beyond the recorded scrolls lies an unfinished work — a neural oracle trained on forgotten dialects. Its name is yet unspoken, its weights yet unsealed.\"",
    ar: "«خلف اللفائف المُدوَّنة عملٌ لم يكتمل — أوراكل عصبي دُرِّب على لهجاتٍ منسية. اسمه لم يُلفَظ بعد، وأوزانه لم تُفكّ.»"
  },
  "hc.foot": {
    en: "You found this chamber because you looked closer than most. The Pharaoh remembers.",
    ar: "وجدت هذه الحجرة لأنك دققت النظر أكثر من غيرك. الفرعون يتذكر."
  },

  // Hero
  "hero.eyebrow": { en: "𓂀 · WELCOME · TRAVELER · 𓋹", ar: "𓂀 · أهلاً · أيها · المسافر · 𓋹" },
  "hero.name1": { en: "AHMED", ar: "أحمد" },
  "hero.name2": { en: "ABD AL-HAFEZ", ar: "عبد الحافظ" },
  "hero.role": { en: "Machine Learning Engineer · Data Analyst · AI Specialist", ar: "مهندس تعلّم آلي · محلل بيانات · أخصائي ذكاء اصطناعي" },
  "hero.tagline": { en: "Decoding the hieroglyphs of modern data. 20+ projects across predictive modeling, interactive dashboards and AI — forged with military discipline.", ar: "أفكّ شيفرة هيروغليفيات البيانات الحديثة. أكثر من 20 مشروعًا في النمذجة التنبؤية ولوحات المعلومات التفاعلية والذكاء الاصطناعي — مصاغة بانضباط عسكري." },
  "hero.cta1": { en: "EXPLORE THE TEMPLE", ar: "استكشف المعبد" },
  "hero.cta2": { en: "VIEW MY WORK", ar: "شاهد أعمالي" },

  // About
  "about.eyebrow": { en: "𓋴 · CHAPTER · I", ar: "𓋴 · الفصل · ١" },
  "about.title": { en: "The Scribe's Tale", ar: "حكاية الكاتب" },
  "about.p1": { en: "Machine Learning Engineer and Data Analyst with 1+ year of hands-on experience in AI, ML and Data Analytics. Trained under the Egyptian Ministry of Communications & Information Technology (MCIT) — Digilians initiative, mastering Python, SQL, R, Excel, Power BI and Tableau.", ar: "مهندس تعلّم آلي ومحلل بيانات بخبرة تتجاوز عامًا من الممارسة في الذكاء الاصطناعي والتعلّم الآلي وتحليل البيانات. تدرّب ضمن مبادرة Digilians التابعة لوزارة الاتصالات وتكنولوجيا المعلومات المصرية، وأتقن Python وSQL وR وExcel وPower BI وTableau." },
  "about.p2_a": { en: "Delivered ", ar: "أنجز " },
  "about.p2_b": { en: "20+ projects", ar: "أكثر من 20 مشروعًا" },
  "about.p2_c": { en: " across predictive modeling, interactive dashboards, HR analytics and logistics intelligence. Holds ", ar: " في النمذجة التنبؤية ولوحات المعلومات التفاعلية وتحليلات الموارد البشرية وذكاء الخدمات اللوجستية. يحمل " },
  "about.p2_d": { en: "12 professional certifications", ar: "12 شهادة احترافية" },
  "about.p2_e": { en: " including Google Data Analytics, IBM AI Fundamentals and Deep Learning for NLP — combining strong mathematical foundations with military-academy discipline.", ar: " من بينها Google Data Analytics وIBM AI Fundamentals وDeep Learning for NLP — مع أسس رياضية قوية وانضباط الكلية العسكرية." },
  "about.stat1": { en: "Projects", ar: "المشاريع" },
  "about.stat2": { en: "Certificates", ar: "الشهادات" },
  "about.stat3": { en: "MCIT Training", ar: "تدريب MCIT" },
  "about.stat3_n": { en: "9 mo", ar: "٩ أشهر" },

  // Skills
  "skills.eyebrow": { en: "𓊪 · CHAPTER · II", ar: "𓊪 · الفصل · ٢" },
  "skills.title": { en: "Sacred Crafts", ar: "الحِرَف المقدّسة" },
  "skills.g1": { en: "Data & Analysis", ar: "البيانات والتحليل" },
  "skills.g2": { en: "Programming", ar: "البرمجة" },
  "skills.g3": { en: "Machine Learning & AI", ar: "التعلّم الآلي والذكاء الاصطناعي" },

  // Certificates
  "cert.eyebrow": { en: "𓋹 · CHAPTER · III", ar: "𓋹 · الفصل · ٣" },
  "cert.title": { en: "Hall of Sacred Tablets", ar: "قاعة الألواح المقدّسة" },
  "cert.intro": { en: "Move your light across the chamber to reveal the engraved tablets of knowledge.", ar: "حرّك ضوءك عبر الحجرة لتكشف ألواح المعرفة المنقوشة." },
  "cert.hidden": { en: "⟡ HIDDEN ⟡", ar: "⟡ مخفي ⟡" },
  "cert.verify": { en: "VERIFY ↗", ar: "تحقّق ↗" },
  "cert.sealLabel": { en: "𓋹 · SACRED · TABLETS · WITHIN · 𓋹", ar: "𓋹 · ألواح · مقدسة · بالداخل · 𓋹" },

  // Projects
  "proj.eyebrow": { en: "𓍢 · CHAPTER · IV", ar: "𓍢 · الفصل · ٤" },
  "proj.title": { en: "Treasure Chamber", ar: "حجرة الكنوز" },
  "proj.sealLabel": { en: "𓊃 · ROYAL · TREASURE · CHAMBER · 𓊃", ar: "𓊃 · حجرة · الكنز · الملكي · 𓊃" },

  // Contact
  "contact.eyebrow": { en: "𓅓 · CHAPTER · V", ar: "𓅓 · الفصل · ٥" },
  "contact.title": { en: "Royal Decree", ar: "المرسوم الملكي" },
  "contact.send": { en: "Send a Message", ar: "أرسل رسالة" },
  "contact.name": { en: "Your Name", ar: "اسمك" },
  "contact.email": { en: "Your Email", ar: "بريدك الإلكتروني" },
  "contact.message": { en: "Your Message", ar: "رسالتك" },
  "contact.submit": { en: "SEAL & SEND", ar: "اختم وأرسل" },
  "contact.direct": { en: "Direct Channels", ar: "قنوات مباشرة" },
  "contact.location": { en: "CAIRO · EGYPT", ar: "القاهرة · مصر" },
  "contact.footer": { en: "BUILT IN THE TEMPLE OF DATA", ar: "صُنع في معبد البيانات" },
  "contact.toast": { en: "Opening your scribe (email client)...", ar: "جاري فتح الكاتب (تطبيق البريد)..." },

  // Entry gate
  "gate.open": { en: "𓂀 OPEN · THE · GATE 𓂀", ar: "𓂀 افتح · البوابة 𓂀" },
  "gate.enter": { en: "ENTER · THE · TEMPLE", ar: "ادخل · المعبد" },
  "gate.skip": { en: "SKIP ›", ar: "تخطّى ›" },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: keyof typeof T) => string;
};

const LangCtx = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  toggle: () => {},
  t: (k) => T[k]?.en ?? String(k),
});

export const useLang = () => useContext(LangCtx);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    const stored = window.localStorage.getItem("temple.lang") as Lang | null;
    return stored === "ar" || stored === "en" ? stored : "en";
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try { window.localStorage.setItem("temple.lang", lang); } catch {}
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(() => setLangState((l) => (l === "en" ? "ar" : "en")), []);
  const t = useCallback((key: keyof typeof T) => T[key]?.[lang] ?? T[key]?.en ?? String(key), [lang]);

  return <LangCtx.Provider value={{ lang, setLang, toggle, t }}>{children}</LangCtx.Provider>;
};