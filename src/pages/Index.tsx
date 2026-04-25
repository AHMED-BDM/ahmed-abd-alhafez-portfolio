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
  const [devMode, setDevMode] = useState(false);
  const { reducedEffects } = usePerformanceMode();

  useEffect(() => {
    document.documentElement.classList.toggle("dev-mode", devMode);
    return () => document.documentElement.classList.remove("dev-mode");
  }, [devMode]);

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
      {/* تم حذف intensity من هنا */}
      <SoundProvider mode={mode} reducedEffects={reducedEffects}>
        <div className={mode === "day" ? "day min-h-screen" : "min-h-screen"}>
          {!entered && <EntryGate onEnter={() => setEntered(true)} />}

          <CustomCursor mode={mode} />
          {/* تم حذف intensity من هنا */}
          <TempleAtmosphere mode={mode} reducedEffects={reducedEffects} />
          <VisionZone mode={mode} />

          <Navbar />
          <LanguageToggle />

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

          {/* تم تبسيط هذا المكون ليحتوي على زر الميوت فقط */}
          <AtmosphereControls />

          <Mummies mode={mode} />
          <Curse reducedEffects={reducedEffects} />
          <Whispers />
          <SecretPapyrus />
          
          <HiddenChamber onOpenBox={openSarcophagus} />
          
          <FourthWall reducedEffects={reducedEffects} />

          <main>
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
