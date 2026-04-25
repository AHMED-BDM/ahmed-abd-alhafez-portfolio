import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from "react";
import { sounds } from "../../audio"; // تأكد من صحة المسار لملف audio.ts

type TempleMode = "night" | "day";
type SoundKind = "hover" | "click" | "open" | "rumble" | "whisper" | "curse" | "glint" | "gust" | "spell";

type Ctx = {
  initialized: boolean;
  enabled: boolean;
  toggle: () => void;
  enableSound: () => void;
  play: (kind: SoundKind, options?: { pan?: number; volume?: number }) => void;
};

const SoundCtx = createContext<Ctx>({
  initialized: false,
  enabled: false,
  toggle: () => {},
  enableSound: () => {},
  play: () => {},
});

export const useSound = () => useContext(SoundCtx);

export const SoundProvider = ({ children, mode }: any) => {
  const [initialized, setInitialized] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const initializeAudio = useCallback(async () => {
    setInitialized(true);
    setEnabled(true);
  }, []);

  // المايسترو: التحكم في كتم أصوات الموقع بالكامل
  useEffect(() => {
    // 1. كتم ملفات الـ Audio العادية
    const allAudioElements = document.querySelectorAll("audio");
    allAudioElements.forEach(a => (a.muted = !enabled));

    // 2. كتم الأصوات المستوردة من ملف audio.ts
    if (sounds) {
      Object.values(sounds).forEach((audio: any) => {
        if (audio instanceof Audio) {
          audio.muted = !enabled;
        }
      });
    }
  }, [enabled]);

  const toggle = useCallback(() => {
    if (!initialized) {
      initializeAudio();
    } else {
      setEnabled(!enabled);
    }
  }, [enabled, initialized, initializeAudio]);

  const play = useCallback((kind: SoundKind) => {
    if (!enabled || !initialized) return;
    // منطق تشغيل المؤثرات الصوتية الإضافية هنا
  }, [enabled, initialized]);

  return (
    <SoundCtx.Provider value={{ initialized, enabled, toggle, enableSound: initializeAudio, play }}>
      {children}
    </SoundCtx.Provider>
  );
};
