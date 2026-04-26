import { sounds } from "../audio";
import { useEffect, useState } from "react";
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
import { DevModeToggle } from "@/components/portfolio/DevModeToggle";
import { VisionZone } from "@/components/portfolio/VisionZone";
import { LanguageToggle } from "@/components/portfolio/LanguageToggle";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

const Index = () => {
  const [entered, setEntered] = useState(false);
  const [mode, setMode] = useState<"night" | "day">("night");
  const [intensity, setIntensity] = useState<"subtle" | "immersive">("immersive");
  const [devMode, setDevMode] = useState(false);
  const { reducedEffects } = usePerformanceMode();

  useEffect(() => {
    document.documentElement.classList.toggle("dev-mode", devMode);
    return () => document.documentElement.classList.remove("dev-mode");
  }, [devMode]);

  // 🔊 دالة تشغيل صوت التابوت
  const openSarcophagus = () => {
    try {
      const audio = sounds.box;
      audio.currentTime = 0;
      audio.play();
    } catch (err) {
      console.log("Audio not ready yet");
    }
  };

  return (
    <LanguageProvider>
      <SoundProvider mode={mode} intensity={intensity} reducedEffects={reducedEffects}>
        <div className={mode === "day" ? "day min-h-screen" : "min-h-screen"}>
          {!entered && <EntryGate onEnter={() => setEntered(true)} />}

          <CustomCursor mode={mode} />
          <TempleAtmosphere mode={mode} intensity={intensity} reducedEffects={reducedEffects} />
          <VisionZone mode={mode} />

          <Navbar />
          <LanguageToggle />

          {/* ✅ تم تعديل زرار النهار والليل لتشغيل وإيقاف الأصوات */}
          <ModeToggle
            mode={mode}
            onToggle={() => {
              const nextMode = mode === "night" ? "day" : "night";
              setMode(nextMode);

              if (nextMode === "day") {
                sounds.night.pause();
                sounds.day.currentTime = 0;
                sounds.day.play().catch(e => console.log("Audio play blocked"));
              } else {
                sounds.day.pause();
                sounds.night.currentTime = 0;
                sounds.night.play().catch(e => console.log("Audio play blocked"));
              }
            }}
          />

          <DevModeToggle
            devMode={devMode}
            onToggle={() => setDevMode(v => !v)}
          />

          <div className="hidden pointer-events-none opacity-0">
            <AtmosphereControls
              intensity={intensity}
              onIntensityToggle={() =>
                setIntensity(v => (v === "immersive" ? "subtle" : "immersive"))
              }
            />
          </div>

          <Mummies mode={mode} />
          <Curse reducedEffects={reducedEffects} />
          <Whispers />
          <SecretPapyrus />
          
          {/* ✅ تمرير دالة الصوت هنا في حال كان التابوت داخل الغرفة السرية */}
          <HiddenChamber onOpenBox={openSarcophagus} />
          
          <FourthWall reducedEffects={reducedEffects} />

          <main>
            {/* ✅ تمرير دالة الصوت هنا في حال كان التابوت في واجهة الموقع */}
            <Hero mode={mode} onOpenBox={openSarcophagus} />
            <About />
            <Skills />
            <Certificates />
            <Projects />
            <GithubDashboard devMode={devMode} />
            <Contact />
          </main>

          <PharaohChat mode={mode} />
        </div>
      </SoundProvider>
    </LanguageProvider>
  );
};

export default Index;
