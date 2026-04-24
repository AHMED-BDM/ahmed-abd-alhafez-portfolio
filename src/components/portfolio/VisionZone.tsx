import { useReadabilityZone } from "@/hooks/useReadabilityZone";

export const VisionZone = ({ enabled, mode }: { enabled: boolean; mode: "night" | "day" }) => {
  const zone = useReadabilityZone(enabled);

  if (!enabled) return null;

  const radius = 220;
  const opacity = zone.active ? 1 : 0;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[55] transition-opacity duration-500"
      style={{
        opacity,
        background:
          mode === "day"
            ? `radial-gradient(circle ${radius}px at ${zone.x}px ${zone.y}px, hsl(var(--background)/0.55) 0%, hsl(var(--background)/0.3) 45%, transparent 75%)`
            : `radial-gradient(circle ${radius}px at ${zone.x}px ${zone.y}px, hsl(var(--background)/0.6) 0%, transparent 70%)`,
        mixBlendMode: mode === "day" ? "multiply" : "normal",
      }}
    />
  );
};