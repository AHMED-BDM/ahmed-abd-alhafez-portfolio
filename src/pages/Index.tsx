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
import { SarcasticWarning } from "@/components/portfolio/SarcasticWarning"; // ✅ ضفنا الرسالة الساخرة

const Index = () => {
  const [entered, setEntered] = useState(false);
  const [mode, setMode] = useState<"night" | "day">("night");
  const [intensity, setIntensity] = useState<"subtle" | "immersive">("immersive");
  const { reducedEffects } = usePerformanceMode();
  
  const [showWarning, setShowWarning] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(true);

  // استماع لقرار المستخدم من الرسالة الساخرة (هل هيوافق يشغل الكشاف ولا هيعاند؟)
  useEffect(() => {
    const handleTorchChange = () => {
      const state = localStorage.getItem("sandstorm_torch");
      if (state === "enabled") {
        setShowSpotlight(true);
      } else if (state === "suffering") {
        setShowSpotlight(false);
      }
    };
    window.addEventListener("torch_state_changed", handleTorchChange);
    return () => window.removeEventListener("torch_state_changed", handleTorchChange);
  }, []);

  // لما المستخدم يدوس على زرار تبديل الليل والنهار
  const handleThemeToggle = () => {
    if (mode === "night") {
      setShowWarning(true);
    } else {
      setMode("night");
      sounds.day.pause();
      sounds.night.currentTime = 0;
      sounds.night.play().catch(e => console.log("Audio blocked"));
    }
  };

  // لو المستخدم وافق على تحدي العاصفة
  const acceptChallenge = () => {
    setShowWarning(false);
    setMode("day");
    setShowSpotlight(true);
    
    // تشغيل أصوات النهار وإيقاف الليل
    sounds.night.pause();
    sounds.day.currentTime = 0;
    sounds.day.play().catch(e => console.log("Audio blocked"));
  };

  // لو المستخدم خاف ورفض التحدي (هنا تبدأ المعاناة!)
  const rejectChallenge = () => {
    setShowWarning(false);
    setMode("day"); // هندخله النهار برضه
    setShowSpotlight(false); // بس هنسحب منه الكشاف!
    
    // إرسال إشارة لـ SarcasticWarning عشان تظهر بعد 3 ثواني
    localStorage.setItem("sandstorm_torch", "refused_first_time");
    window.dispatchEvent(new Event("torch_state_changed"));

    sounds.night.pause();
    sounds.day.currentTime = 0;
    sounds.day.play().catch(e => console.log("Audio blocked"));
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
          
          {/* ✅ مررنا showSpotlight لـ CustomCursor عشان نتحكم فيه في الخطوة الجاية */}
          <CustomCursor mode={mode} showSpotlight={showSpotlight} />
          
          <TempleAtmosphere mode={mode} intensity={intensity} reducedEffects={reducedEffects} />
          <Navbar />
          
          <div className="fixed top-6 right-6 z-[100] flex items-center gap-3">
            <LanguageToggle />
            <ModeToggle mode={mode} onToggle={handleThemeToggle} />
          </div>

          <div className="hidden pointer-events-none opacity-0">
            <AtmosphereControls intensity={intensity} onIntensityToggle={() => setIntensity(v => v === "immersive" ? "subtle" : "immersive")} />
          </div>
          
          <Mummies mode={mode} />
          <Curse reducedEffects={reducedEffects} />
          <Whispers />
          <SecretPapyrus />
          <HiddenChamber /> 
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
          
          {/* العاصفة الرملية */}
          {mode === "day" && <SandstormEffect mode={mode} showSpotlight={showSpotlight} />}
          
          {/* رسالة التحذير العادية عند التحويل للنهار */}
          {showWarning && <SandstormWarning onAccept={acceptChallenge} onReject={rejectChallenge} />}
          
          {/* ✅ الرسالة الساخرة اللي هتظهرله لو رفض التحدي */}
          <SarcasticWarning />
        </div>
      </SoundProvider>
    </LanguageProvider>
  );
};

export default Index;
