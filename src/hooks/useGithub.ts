import { useEffect, useState } from "react";

export interface GhRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  homepage: string | null;
}

export interface GhUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

const CACHE_KEY = "gh:AHMED-BDM:v1";
const CACHE_TTL = 1000 * 60 * 30; // 30 min

interface CacheShape {
  ts: number;
  user: GhUser;
  repos: GhRepo[];
}

const readCache = (): CacheShape | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheShape;
    if (Date.now() - parsed.ts > CACHE_TTL) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const useGithub = (username = "AHMED-BDM") => {
  const [user, setUser] = useState<GhUser | null>(null);
  const [repos, setRepos] = useState<GhRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cached = readCache();
    if (cached) {
      setUser(cached.user);
      setRepos(cached.repos);
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const [uRes, rRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
        ]);
        if (!uRes.ok || !rRes.ok) throw new Error("GitHub API unavailable");
        const uJson = (await uRes.json()) as GhUser;
        const rJson = (await rRes.json()) as GhRepo[];
        if (cancelled) return;
        setUser(uJson);
        setRepos(rJson);
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ ts: Date.now(), user: uJson, repos: rJson })
          );
        } catch {
          /* ignore quota */
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [username]);

  return { user, repos, loading, error };
};

export const aggregateLanguages = (repos: GhRepo[]) => {
  const map = new Map<string, number>();
  for (const r of repos) {
    if (!r.language) continue;
    map.set(r.language, (map.get(r.language) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};