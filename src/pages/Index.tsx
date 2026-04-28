import { sounds } from "../audio";
import { useState, useEffect } from "react";
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
import { SandstormEffect } from "@/components/portfolio/SandstormEffect";
import { SacredInsects } from "@/components/portfolio/SacredInsects";
import { SandstormWarning } from "@/components/portfolio/SandstormWarning";

const Index = () => {
  const [entered, setEntered] = useState(false);
  const [mode, setMode] = useState<"night" | "day">("night");
  const [intensity, setIntensity] = useState<"subtle" | "immersive">("immersive");
  const { reducedEffects } = usePerformanceMode();
  const [showSandstorm, setShowSandstorm] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(true);

  // ✅ عند تبديل الوضع: إذا كان نهاراً => أظهر الرسالة، أظهر العاصفة، أظهر الكشاف
  // ✅ إذا كان ليلاً => أخفِ الرسالة، أبِقِ العاصفة والكشاف افتراضياً
  useEffect(() => {
    if (mode === "day") {
      setShowSandstorm(true);
      setShowWarning(true);
      setShowSpotlight(true);
    } else {
      setShowWarning(false);
      setShowSandstorm(true);
      setShowSpotlight(true);
    }
  }, [mode]);

  // ✅ قبول التحدي: يبقى الكشاف مفعلاً
  const acceptChallenge = () => {
    setShowWarning(false);
    setShowSpotlight(true);
  };

  // ✅ رفض التحدي: نطفئ الكشاف فقط (العاصفة باقية)
  const rejectChallenge = () => {
    setShowWarning(false);
    setShowSpotlight(false);
  };

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
          
          {!entered && <EntryGate onEnter={() => setEntered(true)} />}

          <CustomCursor mode={mode} />
          <TempleAtmosphere mode={mode} intensity={intensity} reducedEffects={reducedEffects} />
          
          <Navbar />

          <div className="fixed top-6 right-6 z-[100] flex items-center gap-3">
            <LanguageToggle />
            <ModeToggle
              mode={mode}
              onToggle={() => {
                const nextMode = mode === "night" ? "day" : "night";
                setMode(nextMode);
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
          <HiddenChamber onOpenBox={openSarcophagus} />
          <FourthWall reducedEffects={reducedEffects} />

          <main className="relative z-10">
            <Hero mode={mode} onOpenBox={openSarcophagus} />
            <About />
            <Skills />
            <VisionZone mode={mode} />
            <Certificates />
            <Projects />
            <GithubDashboard devMode={false} />
            <VolunteeringSarcophagus />
            <Contact />
          </main>

          <PharaohChat mode={mode} />
          <SacredInsects mode={mode} />

          {/* ✅ العاصفة الرملية: تظهر في النهار فقط، وتستقبل showSpotlight من الحالة */}
          {mode === "day" && showSandstorm && <SandstormEffect mode={mode} showSpotlight={showSpotlight} />}

          {/* ✅ رسالة التحذير: تظهر فقط عند showWarning وكون الوضع نهاراً */}
          {showWarning && mode === "day" && (
            <SandstormWarning onAccept={acceptChallenge} onReject={rejectChallenge} />
          )}
        </div>
      </SoundProvider>
    </LanguageProvider>
  );
};

export default Index;
