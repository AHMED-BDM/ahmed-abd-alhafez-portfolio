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