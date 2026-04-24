import { useLang, T } from "@/i18n/LanguageContext";

const links: { id: string; key: keyof typeof T }[] = [
  { id: "about", key: "nav.about" },
  { id: "skills", key: "nav.skills" },
  { id: "certificates", key: "nav.certificates" },
  { id: "projects", key: "nav.projects" },
  { id: "github", key: "nav.github" },
  { id: "contact", key: "nav.contact" },
];
export const Navbar = () => {
  const { t } = useLang();
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-1 px-3 py-2 rounded-full bg-card/70 backdrop-blur border border-primary/30 shadow-gold">
      {links.map(l => (
        <a key={l.id} href={`#${l.id}`}
          className="px-4 py-1.5 text-xs font-display tracking-widest text-foreground/80 hover:text-primary transition-colors">
          {t(l.key).toUpperCase()}
        </a>
      ))}
    </nav>
  );
};
