import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from "react";

type Ctx = {
  enabled: boolean;
  toggle: () => void;
  play: (
    kind: "hover" | "click" | "open" | "rumble" | "whisper" | "curse" | "glint" | "gust",
    options?: { pan?: number; volume?: number }
  ) => void;
};

const SoundCtx = createContext<Ctx>({ enabled: false, toggle: () => {}, play: () => {} });
export const useSound = () => useContext(SoundCtx);

// Minimal WebAudio synth so we don't ship audio files.
const useSynth = () => {
  const ctxRef = useRef<AudioContext | null>(null);
  const ambientRef = useRef<{ stop: () => void } | null>(null);

  const ensure = () => {
    if (!ctxRef.current) {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      ctxRef.current = new AC();
    }
    return ctxRef.current!;
  };

  const withPan = (pan = 0) => {
    const ac = ensure();
    const panner = typeof ac.createStereoPanner === "function" ? ac.createStereoPanner() : null;
    if (panner) panner.pan.value = Math.max(-1, Math.min(1, pan));
    return { ac, panner };
  };

  const tone = (freq: number, dur: number, type: OscillatorType = "sine", vol = 0.04, pan = 0) => {
    const ac = ensure();
    const { panner } = withPan(pan);
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ac.currentTime);
    g.gain.setValueAtTime(0, ac.currentTime);
    g.gain.linearRampToValueAtTime(vol, ac.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
    if (panner) o.connect(g).connect(panner).connect(ac.destination);
    else o.connect(g).connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + dur + 0.05);
  };

  const noise = (dur: number, vol = 0.05, lp = 800, pan = 0) => {
    const ac = ensure();
    const { panner } = withPan(pan);
    const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = ac.createBufferSource();
    src.buffer = buf;
    const f = ac.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = lp;
    const g = ac.createGain();
    g.gain.value = vol;
    if (panner) src.connect(f).connect(g).connect(panner).connect(ac.destination);
    else src.connect(f).connect(g).connect(ac.destination);
    src.start();
  };

  const startAmbient = () => {
    if (ambientRef.current) return;
    const ac = ensure();
    const buf = ac.createBuffer(1, ac.sampleRate * 4, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
    const src = ac.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const f = ac.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 320;
    const g = ac.createGain();
    g.gain.value = 0.025;
    src.connect(f).connect(g).connect(ac.destination);
    src.start();
    ambientRef.current = { stop: () => { src.stop(); } };
  };

  const stopAmbient = () => {
    try { ambientRef.current?.stop(); } catch {}
    ambientRef.current = null;
  };

  return { tone, noise, startAmbient, stopAmbient };
};

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [enabled, setEnabled] = useState(false);
  const synth = useSynth();

  useEffect(() => {
    if (enabled) synth.startAmbient(); else synth.stopAmbient();
  }, [enabled]);

  const play = useCallback((kind: Parameters<Ctx["play"]>[0], options?: { pan?: number; volume?: number }) => {
    if (!enabled) return;
    const pan = options?.pan ?? 0;
    const volume = options?.volume ?? 1;
    switch (kind) {
      case "hover": synth.tone(880, 0.12, "sine", 0.02 * volume, pan); break;
      case "click": synth.tone(660, 0.18, "triangle", 0.05 * volume, pan); setTimeout(() => synth.tone(990, 0.15, "sine", 0.04 * volume, pan), 60); break;
      case "open": synth.noise(1.6, 0.08 * volume, 500, pan); setTimeout(() => synth.tone(196, 0.8, "sawtooth", 0.04 * volume, pan), 200); break;
      case "rumble": synth.noise(2, 0.1 * volume, 200, pan); break;
      case "whisper": synth.noise(2.4, 0.04 * volume, 1500, pan); break;
      case "curse": synth.tone(110, 1.2, "sawtooth", 0.06 * volume, pan); synth.noise(1.2, 0.06 * volume, 400, pan); break;
      case "glint": synth.tone(740, 0.18, "triangle", 0.018 * volume, pan); setTimeout(() => synth.tone(1110, 0.12, "sine", 0.012 * volume, pan), 40); break;
      case "gust": synth.noise(2.2, 0.028 * volume, 900, pan); break;
    }
  }, [enabled, synth]);

  const toggle = useCallback(() => setEnabled(e => !e), []);

  return <SoundCtx.Provider value={{ enabled, toggle, play }}>{children}</SoundCtx.Provider>;
};

export const SoundToggle = () => {
  const { enabled, toggle } = useSound();
  return (
    <button onClick={toggle}
      aria-label={enabled ? "Mute sound" : "Enable sound"}
      className="fixed top-24 right-6 z-[75] w-11 h-11 rounded-full border-2 border-primary/60 bg-card/80 backdrop-blur text-primary hover:shadow-gold transition flex items-center justify-center font-display">
      {enabled ? "𓂀" : "𓁹"}
      <span className="sr-only">{enabled ? "Sound on" : "Sound off"}</span>
    </button>
  );
};