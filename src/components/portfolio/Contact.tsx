import { SectionTitle } from "./About";
import { Mail, Linkedin, Github, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:ahmed.abdalhafez.777@gmail.com?subject=${subject}&body=${body}`;
    toast.success("Opening your scribe (email client)...");
  };

  return (
    <section id="contact" className="relative py-28 px-6">
      <div className="container max-w-5xl">
        <SectionTitle eyebrow="𓅓 · CHAPTER · V" title="Royal Decree" />
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-papyrus p-10 shadow-deep relative" style={{ color: "hsl(25 60% 18%)" }}>
            <h3 className="font-display text-2xl mb-6">Send a Message</h3>
            <form onSubmit={submit} className="space-y-4">
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                placeholder="Your Name"
                className="w-full bg-transparent border-b-2 border-amber-900/50 focus:border-amber-900 outline-none py-2 placeholder:text-amber-900/50" />
              <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="Your Email"
                className="w-full bg-transparent border-b-2 border-amber-900/50 focus:border-amber-900 outline-none py-2 placeholder:text-amber-900/50" />
              <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                placeholder="Your Message"
                className="w-full bg-transparent border-2 border-amber-900/40 focus:border-amber-900 outline-none p-3 placeholder:text-amber-900/50 resize-none" />
              <button type="submit" className="w-full py-3 bg-amber-900 text-amber-50 font-display tracking-widest hover:bg-amber-800 transition">
                SEAL & SEND
              </button>
            </form>
          </div>

          <div className="gold-frame bg-card/70 backdrop-blur p-10 shadow-deep">
            <h3 className="font-display text-2xl text-gold mb-6">Direct Channels</h3>
            <ul className="space-y-5">
              <ContactLink icon={<Mail/>} label="ahmed.abdalhafez.777@gmail.com" href="mailto:ahmed.abdalhafez.777@gmail.com" />
              <ContactLink icon={<Phone/>} label="+20 1155196833" href="tel:+201155196833" />
              <ContactLink icon={<Linkedin/>} label="linkedin.com/in/ahmed-abd-al-hafez" href="https://linkedin.com/in/ahmed-abd-al-hafez" />
              <ContactLink icon={<Github/>} label="GitHub" href="https://github.com" />
            </ul>
            <div className="mt-10 pt-6 border-t border-primary/30 text-center">
              <p className="text-primary text-3xl torch-flicker">𓂀 𓋹 𓊪</p>
              <p className="text-xs text-foreground/60 tracking-widest mt-3">CAIRO · EGYPT</p>
            </div>
          </div>
        </div>
      </div>
      <footer className="text-center text-xs tracking-widest text-foreground/50 mt-20">
        © {new Date().getFullYear()} AHMED ABD AL-HAFEZ · BUILT IN THE TEMPLE OF DATA
      </footer>
    </section>
  );
};

const ContactLink = ({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) => (
  <li>
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-4 group text-foreground/85 hover:text-primary transition-colors">
      <span className="w-10 h-10 rounded-full border border-primary/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
        {icon}
      </span>
      <span className="font-serif text-lg">{label}</span>
    </a>
  </li>
);
