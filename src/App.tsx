import { useEffect } from "react";
import { sounds, setupAudio } from "./audio";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => {

  // ✅ تشغيل الصوت بعد أول click (مهم جدًا)
  useEffect(() => {
    const startAudio = () => {
      setupAudio();

      // صوت البوابة
      sounds.gate.currentTime = 0;
      sounds.gate.play();

      // يبدأ بوضع الليل
      sounds.night.currentTime = 0;
      sounds.night.play();

      document.removeEventListener("click", startAudio);
    };

    document.addEventListener("click", startAudio);
  }, []);

  // ✅ الهمسات كل 30 ثانية (بشكل عشوائي)
  useEffect(() => {
    const whisperInterval = setInterval(() => {
      if (Math.random() < 0.5) {
        sounds.whisper.currentTime = 0;
        sounds.whisper.play();
      }
    }, 30000);

    return () => clearInterval(whisperInterval);
  }, []);

  // ✅ صوت الشبح كل 50 ثانية (نادر)
  useEffect(() => {
    const ghostInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        sounds.ghost.currentTime = 0;
        sounds.ghost.play();
      }
    }, 50000);

    return () => clearInterval(ghostInterval);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
