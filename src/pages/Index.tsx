import { sounds } from "../audio";
import { useState } from "react";
import { EntryGate } from "@/components/portfolio/EntryGate";
import { CustomCursor } from "@/components/portfolio/CustomCursor";
import { ModeToggle } from "@/components/portfolio/ModeToggle";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Skills } from "@/components/portfolio/Skills";
import { Certificates } from "@/components/portfolio/Certificates";
import { Projects } from "@/components/portfolio/Projects";
import { Contact } from "@/components/portfolio/Contact";
import { SoundProvider } from "@/components/portfolio/SoundContext";
import { Mummies } from "@/components/portfolio/Mummies";
import { Curse } from "@/components/portfolio/Curse";
import { Whispers } from "@/components/portfolio/Whispers";
import { SecretPapyrus } from "@/components/portfolio/SecretPapyrus";
import { TempleAtmosphere } from "@/components/portfolio/TempleAtmosphere";
import { PharaohChat } from "@/components/portfolio/PharaohChat";
import { AtmosphereControls } from "@/components/portfolio/AtmosphereControls";
import { FourthWall } from "@/components/portfolio/FourthWall";
import { HiddenChamber } from "@/components/portfolio/HiddenChamber";
import { GithubDashboard } from "@/components/portfolio/GithubDashboard";
import { VisionZone } from "@/components/portfolio/VisionZone";
import { LanguageToggle } from "@/components/portfolio/LanguageToggle";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { VolunteeringSarcophagus } from "@/components/portfolio/VolunteeringSarcophagus";

const Index = () => {
  const [entered, setEntered] = useState(false);
  const [mode, setMode] = useState<"night" | "day">("night");
  const [intensity, setIntensity] = useState<"subtle" | "immersive">("immersive");
  const { reducedEffects } = usePerformanceMode();

  // 🔊 دالة تشغيل صوت التابوت عند التفاعل مع العناصر الملكية
  const openSarcophagus = () => {
    try {
      const audio = sounds.box;
      audio.currentTime = 0;
      audio.play().catch(() => console.log("Audio play interaction needed"));
    } catch (err) {
      console.log("Audio not ready yet");
    }
  };

  return (
    <LanguageProvider>
      <SoundProvider mode={mode} intensity={intensity} reducedEffects={reducedEffects}>
        <div className={mode === "day" ? "day min-h-screen bg-stone-50" : "min-h-screen bg-black"}>
          
          {/* بوابات الدخول والطقوس */}
          {!entered && <EntryGate onEnter={() => setEntered(true)} />}

          {/* عناصر الواجهة الثابتة */}
          <CustomCursor mode={mode} />
          <TempleAtmosphere mode={mode} intensity={intensity} reducedEffects={reducedEffects} />
          
          <Navbar />

          {/* أزرار التحكم (اللغة والمود) */}
          <div className="fixed top-6 right-6 z-[100] flex items-center gap-3">
            <LanguageToggle />
            <ModeToggle
              mode={mode}
              onToggle={() => {
                const nextMode = mode === "night" ? "day" : "night";
                setMode(nextMode);
                // تبديل الموسيقى الخلفية بناءً على الوقت (ليل/نهار)
                if (nextMode === "day") {
                  sounds.night.pause();
                  sounds.day.currentTime = 0;
                  sounds.day.play().catch(e => console.log("Audio blocked"));
                } else {
                  sounds.day.pause();
                  sounds.night.currentTime = 0;
                  sounds.night.play().catch(e => console.log("Audio blocked"));
                }
              }}
            />
          </div>

          {/* أدوات التحكم المخفية في الغلاف الجوي */}
          <div className="hidden pointer-events-none opacity-0">
            <AtmosphereControls
              intensity={intensity}
              onIntensityToggle={() =>
                setIntensity(v => (v === "immersive" ? "subtle" : "immersive"))
              }
            />
          </div>

          {/* العناصر التفاعلية السحرية */}
          <Mummies mode={mode} />
          <Curse reducedEffects={reducedEffects} />
          <Whispers />
          <SecretPapyrus />
          <HiddenChamber onOpenBox={openSarcophagus} />
          <FourthWall reducedEffects={reducedEffects} />

          {/* المحتوى الأساسي للموقع */}
          <main className="relative z-10">
            {/* 1. قسم الواجهة: يظهر فيه صورتك الرسمية professional-photo.jpeg */}
            <Hero mode={mode} onOpenBox={openSarcophagus} />
            
            <About />
            
            <Skills />

            {/* 2. ✅ قسم الرؤية: يظهر فيه صورتك بالصولجان personal-photo.png في منتصف الصفحة */}
            <VisionZone mode={mode} />

            <Certificates />
            
            <Projects />
            
            {/* لوحة بيانات GitHub (Developer Mode Off) */}
            <GithubDashboard devMode={false} />

            {/* قسم التطوع والقيادة (Required for Grade) */}
            <VolunteeringSarcophagus />

            <Contact />
          </main>

          {/* شات القائد الفرعوني */}
          <PharaohChat mode={mode} />
          
        </div>
      </SoundProvider>
    </LanguageProvider>
  );
};

export default Index;
