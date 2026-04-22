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
import { SoundProvider, SoundToggle } from "@/components/portfolio/SoundContext";
import { Mummies } from "@/components/portfolio/Mummies";
import { Curse } from "@/components/portfolio/Curse";
import { Whispers } from "@/components/portfolio/Whispers";
import { SecretPapyrus } from "@/components/portfolio/SecretPapyrus";

const Index = () => {
  const [entered, setEntered] = useState(false);
  const [mode, setMode] = useState<"night" | "day">("night");

  return (
    <SoundProvider>
      <div className={mode === "day" ? "day min-h-screen" : "min-h-screen"}>
        {!entered && <EntryGate onEnter={() => setEntered(true)} />}
        <CustomCursor mode={mode} />
        <Navbar />
        <ModeToggle mode={mode} onToggle={() => setMode(m => m === "night" ? "day" : "night")} />
        <SoundToggle />
        <Mummies mode={mode} />
        <Curse />
        <Whispers />
        <SecretPapyrus />
        <main>
          <Hero mode={mode} />
          <About />
          <Skills />
          <Certificates />
          <Projects />
          <Contact />
        </main>
      </div>
    </SoundProvider>
  );
};

export default Index;
