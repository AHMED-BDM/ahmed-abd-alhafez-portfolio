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
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

const Index = () => {
  const [entered, setEntered] = useState(false);
  const [mode, setMode] = useState<"night" | "day">("night");
  const [intensity, setIntensity] = useState<"subtle" | "immersive">("immersive");
  const { reducedEffects } = usePerformanceMode();

  return (
    <SoundProvider mode={mode} intensity={intensity} reducedEffects={reducedEffects}>
      <div className={mode === "day" ? "day min-h-screen" : "min-h-screen"}>
        {!entered && <EntryGate onEnter={() => setEntered(true)} />}
        <CustomCursor mode={mode} />
        <TempleAtmosphere mode={mode} intensity={intensity} reducedEffects={reducedEffects} />
        <Navbar />
        <ModeToggle mode={mode} onToggle={() => setMode(m => m === "night" ? "day" : "night")} />
        <AtmosphereControls
          intensity={intensity}
          onIntensityToggle={() => setIntensity((value) => (value === "immersive" ? "subtle" : "immersive"))}
        />
        <Mummies mode={mode} />
        <Curse reducedEffects={reducedEffects} />
        <Whispers />
        <SecretPapyrus />
        <HiddenChamber />
        <FourthWall reducedEffects={reducedEffects} />
        <main>
          <Hero mode={mode} />
          <About />
          <Skills />
          <Certificates />
          <Projects />
          <Contact />
        </main>
        <PharaohChat mode={mode} />
      </div>
    </SoundProvider>
  );
};

export default Index;
