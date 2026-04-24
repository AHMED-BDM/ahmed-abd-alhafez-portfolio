const links = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "certificates", label: "Certificates" },
  { id: "projects", label: "Projects" },
  { id: "github", label: "GitHub" },
  { id: "contact", label: "Contact" },
];
export const Navbar = () => (
  <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center gap-1 px-3 py-2 rounded-full bg-card/70 backdrop-blur border border-primary/30 shadow-gold">
    {links.map(l => (
      <a key={l.id} href={`#${l.id}`}
        className="px-4 py-1.5 text-xs font-display tracking-widest text-foreground/80 hover:text-primary transition-colors">
        {l.label.toUpperCase()}
      </a>
    ))}
  </nav>
);
