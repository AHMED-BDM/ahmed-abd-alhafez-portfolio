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

  // تغيير اتجاه الصفحة عند تغيير اللغة
  useEffect(() => {
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [lang]);

  // تشغيل الصوت الخلفي
  useEffect(() => {
    const startAudio = () => {
      setupAudio();
      sounds.night.currentTime = 0;
      sounds.night.loop = true;
      sounds.night.play().catch(e => console.log("Audio play blocked"));
      document.removeEventListener("click", startAudio);
    };
    document.addEventListener("click", startAudio);
  }, []);

  // الهمسات كل 30 ثانية
  useEffect(() => {
    const whisperInterval = setInterval(() => {
      if (Math.random() < 0.5) {
        sounds.whisper.currentTime = 0;
        sounds.whisper.play().catch(e => {});
      }
    }, 30000);
    return () => clearInterval(whisperInterval);
  }, []);

  // صوت الشبح كل 50 ثانية
  useEffect(() => {
    const ghostInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        sounds.ghost.currentTime = 0;
        sounds.ghost.play().catch(e => {});
      }
    }, 50000);
    return () => clearInterval(ghostInterval);
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
