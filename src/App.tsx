import { useEffect } from "react";
import { useLang } from "@/i18n/LanguageContext";
import { sounds, setupAudio } from "./audio";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import { GhostManager } from "@/components/portfolio/GhostManager";

const queryClient = new QueryClient();

const App = () => {
  const { lang } = useLang();

  // تغيير اتجاه الصفحة حسب اللغة
  useEffect(() => {
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [lang]);

  // تشغيل الصوت الأساسي (مرة واحدة عند أول click)
  useEffect(() => {
    const startAudio = () => {
      setupAudio();

      const audio = sounds.night;
      audio.currentTime = 0;
      audio.loop = true;

      audio.play().catch((e) => {
        console.log("Audio play blocked:", e);
      });

      document.removeEventListener("click", startAudio);
    };

    document.addEventListener("click", startAudio);
  }, []);

  // الهمسات كل 30 ثانية
  useEffect(() => {
    const whisperInterval = setInterval(() => {
      if (Math.random() < 0.5) {
        const audio = sounds.whisper;
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    }, 30000);

    return () => clearInterval(whisperInterval);
  }, []);

  // صوت الشبح كل 50 ثانية
  useEffect(() => {
    const ghostInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        const audio = sounds.ghost;
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    }, 50000);

    return () => clearInterval(ghostInterval);
  }, []);

  // ✅ صوت الخوف (Scared Sound)
  useEffect(() => {
    const scaredInterval = setInterval(() => {
      const audio = sounds.scared;

      if (!audio) return;

      audio.currentTime = 0;
      audio.volume = 0.7;

      audio.play().catch((e) => {
        console.log("scaredSound blocked:", e);
      });
    }, 80000);

    return () => clearInterval(scaredInterval);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GhostManager />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
