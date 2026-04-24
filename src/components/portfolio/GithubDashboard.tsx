import { useMemo, useState } from "react";
import { Star, GitFork, ExternalLink, Github, Loader2 } from "lucide-react";
import { SectionTitle } from "./About";
import { aggregateLanguages, useGithub, type GhRepo } from "@/hooks/useGithub";

const LANG_GLYPH: Record<string, string> = {
  Python: "𓂀",
  JavaScript: "𓊪",
  TypeScript: "𓋹",
  HTML: "𓆣",
  CSS: "𓎛",
  Jupyter: "𓏏",
  "Jupyter Notebook": "𓏏",
  R: "𓆗",
  Java: "𓊨",
  Shell: "𓋴",
};

const LANG_COLOR: Record<string, string> = {
  Python: "hsl(42 78% 55%)",
  JavaScript: "hsl(48 90% 60%)",
  TypeScript: "hsl(200 65% 55%)",
  HTML: "hsl(8 65% 55%)",
  CSS: "hsl(200 60% 45%)",
  "Jupyter Notebook": "hsl(28 70% 50%)",
  R: "hsl(220 60% 55%)",
  Java: "hsl(8 55% 50%)",
  Shell: "hsl(120 30% 50%)",
};

const Counter = ({ value, label }: { value: number; label: string }) => (
  <div className="text-center border-t-2 border-primary/40 pt-3">
    <div className="font-display text-3xl md:text-4xl text-gold tabular-nums" data-readable>
      {value.toLocaleString()}
    </div>
    <div className="text-[10px] tracking-[0.3em] text-foreground/70 mt-1" data-readable>
      {label}
    </div>
  </div>
);

const RepoTablet = ({ repo, onOpen }: { repo: GhRepo; onOpen: () => void }) => {
  const glyph = LANG_GLYPH[repo.language ?? ""] ?? "𓊃";
  const color = LANG_COLOR[repo.language ?? ""] ?? "hsl(var(--primary))";
  return (
    <button
      onClick={onOpen}
      data-cursor="native"
      className="group relative text-left bg-stone gold-frame p-5 shadow-deep hover:shadow-gold transition-all duration-500 hover:-translate-y-1"
    >
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(transparent 95%, hsl(var(--primary)/0.4) 96%), linear-gradient(90deg, transparent 95%, hsl(var(--primary)/0.3) 96%)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl torch-flicker" style={{ color }}>
              {glyph}
            </span>
            <h3
              className="font-display text-lg text-gold tracking-wide truncate"
              data-readable
            >
              {repo.name}
            </h3>
          </div>
          <p className="text-sm text-foreground/80 line-clamp-2 min-h-[2.5rem]" data-readable>
            {repo.description ?? "نقش غامض من سجل المطور..."}
          </p>
        </div>
      </div>
      <div className="relative mt-4 flex items-center justify-between text-xs tracking-widest text-foreground/70">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1" data-readable>
            <Star className="w-3.5 h-3.5 text-primary" /> {repo.stargazers_count}
          </span>
          <span className="flex items-center gap-1" data-readable>
            <GitFork className="w-3.5 h-3.5 text-primary" /> {repo.forks_count}
          </span>
        </div>
        {repo.language && (
          <span
            className="px-2 py-0.5 border border-primary/50 text-[10px]"
            style={{ color }}
            data-readable
          >
            {repo.language.toUpperCase()}
          </span>
        )}
      </div>
      <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shimmer-gold" />
    </button>
  );
};

const LanguageRadial = ({ data }: { data: { name: string; count: number }[] }) => {
  const top = data.slice(0, 6);
  const total = top.reduce((s, d) => s + d.count, 0) || 1;
  let acc = 0;
  const segments = top.map((d) => {
    const start = (acc / total) * 360;
    acc += d.count;
    const end = (acc / total) * 360;
    return { ...d, start, end };
  });
  const gradient = `conic-gradient(${segments
    .map(
      (s) =>
        `${LANG_COLOR[s.name] ?? "hsl(var(--primary))"} ${s.start}deg ${s.end}deg`
    )
    .join(", ")})`;

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="relative w-48 h-48 shrink-0">
        <div
          className="absolute inset-0 rounded-full shadow-gold"
          style={{ background: gradient }}
        />
        <div className="absolute inset-4 rounded-full bg-card border border-primary/40 flex items-center justify-center">
          <span className="font-display text-3xl text-gold" data-readable>
            𓂀
          </span>
        </div>
      </div>
      <ul className="flex-1 grid grid-cols-2 gap-3 w-full">
        {top.map((d) => (
          <li key={d.name} className="flex items-center gap-2 text-sm" data-readable>
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ background: LANG_COLOR[d.name] ?? "hsl(var(--primary))" }}
            />
            <span className="font-display tracking-wide text-foreground/90 flex-1">
              {d.name}
            </span>
            <span className="text-primary tabular-nums">{d.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const GithubDashboard = ({ devMode }: { devMode: boolean }) => {
  const { user, repos, loading, error } = useGithub("AHMED-BDM");
  const [active, setActive] = useState<GhRepo | null>(null);

  const stats = useMemo(() => {
    const stars = repos.reduce((s, r) => s + r.stargazers_count, 0);
    const forks = repos.reduce((s, r) => s + r.forks_count, 0);
    return { stars, forks, count: repos.length };
  }, [repos]);

  const langs = useMemo(() => aggregateLanguages(repos), [repos]);
  const featured = useMemo(
    () =>
      [...repos]
        .sort((a, b) => b.stargazers_count - a.stargazers_count || +new Date(b.updated_at) - +new Date(a.updated_at))
        .slice(0, devMode ? 12 : 6),
    [repos, devMode]
  );

  return (
    <section id="github" className="relative py-28 px-6">
      <div className="container max-w-6xl">
        <SectionTitle eyebrow="𓊪 · CHAPTER · V" title="سجل المطور الملكي" />

        {loading && (
          <div className="flex items-center justify-center gap-2 text-primary py-10" data-readable>
            <Loader2 className="w-5 h-5 animate-spin" /> فك رموز السجل...
          </div>
        )}

        {error && !loading && (
          <div className="text-center text-foreground/70 py-6" data-readable>
            تعذر استدعاء السجل من الإله Octocat — {error}
          </div>
        )}

        {!loading && user && (
          <>
            <div className="gold-frame bg-card/70 backdrop-blur p-6 md:p-8 shadow-deep mb-10">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  loading="lazy"
                  className="w-24 h-24 rounded-full border-2 border-primary shadow-gold"
                />
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-display text-2xl text-gold" data-readable>
                    {user.name ?? user.login}
                  </h3>
                  <p className="text-sm text-foreground/80 mt-1" data-readable>
                    {user.bio ?? "كاتب نقوش الكود في المعبد الرقمي"}
                  </p>
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="native"
                    className="inline-flex items-center gap-1.5 mt-3 text-primary hover:text-primary-glow text-xs tracking-widest"
                  >
                    <Github className="w-3.5 h-3.5" /> @{user.login}
                  </a>
                </div>
                <div className="grid grid-cols-3 gap-6 md:gap-10">
                  <Counter value={stats.count} label="REPOS" />
                  <Counter value={stats.stars} label="STARS" />
                  <Counter value={stats.forks} label="FORKS" />
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8 mb-12">
              <div className="gold-frame bg-card/60 backdrop-blur p-6 shadow-deep">
                <h4
                  className="font-display text-sm tracking-[0.3em] text-primary mb-4 text-center"
                  data-readable
                >
                  𓎛 · لغات النقوش · 𓎛
                </h4>
                <LanguageRadial data={langs} />
              </div>
              <div className="gold-frame bg-card/60 backdrop-blur p-6 shadow-deep">
                <h4
                  className="font-display text-sm tracking-[0.3em] text-primary mb-4 text-center"
                  data-readable
                >
                  𓂀 · نقوش رقمية · 𓂀
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <Counter value={user.followers} label="FOLLOWERS" />
                  <Counter value={user.following} label="FOLLOWING" />
                  <Counter value={user.public_repos} label="PUBLIC REPOS" />
                  <Counter value={langs.length} label="LANGUAGES" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((r) => (
                <RepoTablet key={r.id} repo={r} onOpen={() => setActive(r)} />
              ))}
            </div>
          </>
        )}
      </div>

      {active && (
        <div
          onClick={() => setActive(null)}
          className="fixed inset-0 z-[80] bg-background/95 backdrop-blur-md flex items-center justify-center p-6 reveal-up cursor-auto pointer-events-auto"
          data-cursor="native"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="gold-frame bg-card max-w-2xl w-full p-8 cursor-auto"
            data-cursor="native"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="font-display text-2xl text-gold" data-readable>
                  {active.name}
                </h3>
                {active.language && (
                  <span
                    className="text-xs tracking-widest"
                    style={{ color: LANG_COLOR[active.language] ?? "hsl(var(--primary))" }}
                    data-readable
                  >
                    {active.language}
                  </span>
                )}
              </div>
              <a
                href={active.html_url}
                target="_blank"
                rel="noreferrer"
                data-cursor="native"
                className="text-primary hover:text-primary-glow flex items-center gap-1 text-xs tracking-widest"
              >
                <ExternalLink className="w-4 h-4" /> OPEN
              </a>
            </div>
            <p className="text-foreground/85 leading-relaxed" data-readable>
              {active.description ?? "نقش بلا وصف — ادخل المعبد لاكتشافه."}
            </p>
            <div className="flex items-center gap-4 mt-6 text-sm text-foreground/80">
              <span className="flex items-center gap-1" data-readable>
                <Star className="w-4 h-4 text-primary" /> {active.stargazers_count}
              </span>
              <span className="flex items-center gap-1" data-readable>
                <GitFork className="w-4 h-4 text-primary" /> {active.forks_count}
              </span>
              <span className="text-xs tracking-widest text-foreground/60 ml-auto" data-readable>
                UPDATED {new Date(active.updated_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};