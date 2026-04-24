import { useReadabilityZone } from "@/hooks/useReadabilityZone";

/**
 * Torch-like reveal: when the cursor hovers any text, sand/dust around it
 * fades and the text glows. In day mode it punches a brighter "clear" hole
 * through the sandstorm so text becomes readable.
 */
export const VisionZone = ({ mode }: { mode: "night" | "day" }) => {
  const zone = useReadabilityZone(true);
  const radius = 240;
  const opacity = zone.active ? 1 : 0;

  if (mode === "day") {
    return (
      <>
        {/* 1. Cut/lighten the sandstorm haze near cursor */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[40] transition-opacity duration-300"
          style={{
            opacity,
            background: `radial-gradient(circle ${radius}px at ${zone.x}px ${zone.y}px, hsl(0 0% 100% / 0.35) 0%, hsl(0 0% 100% / 0.15) 45%, transparent 75%)`,
            mixBlendMode: "screen",
          }}
        />
        {/* 2. Soft dark vignette behind text for contrast */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[55] transition-opacity duration-300"
          style={{
            opacity,
            background: `radial-gradient(circle ${radius}px at ${zone.x}px ${zone.y}px, hsl(var(--background)/0.55) 0%, hsl(var(--background)/0.25) 50%, transparent 78%)`,
            mixBlendMode: "multiply",
          }}
        />
        {/* 3. Golden torch glow */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[56] transition-opacity duration-300"
          style={{
            opacity: opacity * 0.9,
            background: `radial-gradient(circle ${radius * 0.55}px at ${zone.x}px ${zone.y}px, hsl(var(--primary) / 0.18) 0%, transparent 70%)`,
            mixBlendMode: "screen",
          }}
        />
      </>
    );
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[55] transition-opacity duration-300"
      style={{
        opacity,
        background: `radial-gradient(circle ${radius}px at ${zone.x}px ${zone.y}px, hsl(var(--background)/0.55) 0%, transparent 70%)`,
      }}
    />
  );
};