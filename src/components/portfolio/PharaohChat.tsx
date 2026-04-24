import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSound } from "./SoundContext";
import { useLang } from "@/i18n/LanguageContext";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const starterMessage: ChatMessage = {
  role: "assistant",
  content:
    "**𓂀 Oracle of the Pharaoh** is awake. Ask about Ahmed's projects, certificates, skills, or career path and I shall reveal the scrolls.",
};

const suggestionPrompts = [
  "Summarize Ahmed's strongest AI skills.",
  "Which project should a recruiter open first?",
  "Tell me about the certificates in this temple.",
];

export const PharaohChat = ({ mode }: { mode: "night" | "day" }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage]);
  const { play } = useSound();
  const { t } = useLang();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const greetedRef = useRef(false);

  const panelClasses = useMemo(
    () =>
      mode === "night"
        ? "bg-card/95 backdrop-blur-xl"
        : "bg-card/90 backdrop-blur-md",
    [mode],
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open && !greetedRef.current) {
      greetedRef.current = true;
      console.log("[PharaohChat] First open — fourth-wall greeting");
      const greet = t("chat.greet");
      window.setTimeout(() => {
        setMessages((current) => [
          ...current,
          { role: "assistant", content: greet },
        ]);
      }, 700);
    }
  }, [open, t]);

  const sendMessage = async (prefill?: string) => {
    const content = (prefill ?? input).trim();
    if (!content || loading) return;

    const userMessage: ChatMessage = { role: "user", content };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    play("click", { pan: 0.4, volume: 0.65 });

    const { data, error } = await supabase.functions.invoke("pharaoh-chat", {
      body: { messages: nextMessages },
    });

    if (error || !data?.reply) {
      const status = (error as { context?: { status?: number } } | null)?.context?.status;
      const description =
        status === 429
          ? "The temple is busy. Try again in a moment."
          : status === 402
            ? "AI usage needs more workspace credit before the oracle can answer."
            : "The oracle could not answer. Please try again.";
      toast.error(description);
      play("curse", { pan: -0.3, volume: 0.35 });
      setLoading(false);
      return;
    }

    setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    play("glint", { pan: -0.35, volume: 0.75 });
    setLoading(false);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await sendMessage();
  };

  return (
    <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-3 cursor-auto pointer-events-auto" data-cursor="native">
      {open && (
        <div className={`gold-frame w-[min(24rem,calc(100vw-1.5rem))] shadow-deep cursor-auto pointer-events-auto ${panelClasses}`} data-cursor="native">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
            <div>
              <p className="font-display text-sm tracking-[0.28em] text-primary">𓂀 ORACLE</p>
              <p className="text-xs text-foreground/65">Pharaoh-style AI guide</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground/70 hover:text-primary"
              onClick={() => {
                setOpen(false);
                play("click", { pan: 0.45, volume: 0.6 });
              }}
            >
              <X />
            </Button>
          </div>

          <div className="border-b border-border/60 px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {suggestionPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendMessage(prompt)}
                  className="rounded-md border border-primary/40 bg-background/35 px-3 py-1.5 text-left text-[11px] tracking-wide text-foreground/80 transition hover:border-primary hover:text-primary"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <ScrollArea className="h-[24rem] px-4 py-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={message.role === "assistant" ? "mr-8" : "ml-8 flex justify-end"}
                >
                  <div
                    className={
                      message.role === "assistant"
                        ? "rounded-md border border-primary/35 bg-background/40 px-4 py-3 text-sm shadow-engrave"
                        : "rounded-md bg-primary px-4 py-3 text-sm text-primary-foreground shadow-gold"
                    }
                  >
                    {message.role === "assistant" ? (
                      <div className="space-y-2 text-foreground/90 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:leading-6 [&_p]:m-0 [&_strong]:text-primary [&_ul]:list-disc [&_ul]:pl-5">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-6">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="mr-8 rounded-md border border-primary/30 bg-background/35 px-4 py-3 text-sm text-foreground/70">
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                    The oracle is reading the chamber walls...
                  </span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <form onSubmit={onSubmit} className="border-t border-border/70 p-4">
            <div className="flex gap-3">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about projects, certificates, or Ahmed's path..."
                rows={2}
                className="min-h-[3.25rem] resize-none border-primary/25 bg-background/40 text-foreground placeholder:text-muted-foreground"
              />
              <Button
                type="submit"
                size="icon"
                className="h-auto min-h-[3.25rem] shrink-0 px-3"
                disabled={loading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}

      <Button
        size="lg"
        className="gold-frame h-14 rounded-full px-5 shadow-gold"
        onMouseEnter={() => play("hover", { pan: 0.45, volume: 0.8 })}
        onClick={() => {
          setOpen((current) => !current);
          play("click", { pan: 0.45, volume: 0.65 });
        }}
      >
        <MessageCircle className="h-5 w-5" />
        ORACLE
      </Button>
    </div>
  );
};