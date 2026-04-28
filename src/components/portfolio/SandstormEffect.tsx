import { useEffect, useRef, useState } from "react";

interface SandstormEffectProps {
  mode: "day" | "night";
}

export const SandstormEffect = ({ mode }: SandstormEffectProps) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Array<{ x: number; y: number; size: number; speedX: number; speedY: number; opacity: number }>>([]);
  const lastTimestampRef = useRef<number>(0);

  // تفعيل فقط في وضع النهار
  if (mode !== "day") return null;

  // تهيئة جزيئات الرمال
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    // إنشاء 300 جزيئة رمل
    const particleCount = 300;
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
      });
    }

    const render = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // رسم طبقة الضباب الرملي (خلفية عكرة)
      ctx.fillStyle = "rgba(194, 150, 70, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // رسم الجزيئات
      for (let p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 170, 80, ${p.opacity * 0.8})`;
        ctx.fill();
      }
      
      // رسم تأثير الكشاف (فتحة دائرية حول الماوس)
      if (isHovering && mousePos.x > 0 && mousePos.y > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 130, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.9)";
        ctx.fill();
        
        // إضافة تأثير توهج خفيف حول الحافة
        ctx.globalCompositeOperation = "source-over";
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 130, 0, Math.PI * 2);
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(255,215,0,0.5)";
        ctx.strokeStyle = "rgba(255,215,0,0.4)";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      }
      
      animationRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [isHovering, mousePos]);

  // تحديث مواقع الجزيئات
  useEffect(() => {
    const animateParticles = (timestamp: number) => {
      if (lastTimestampRef.current === 0) {
        lastTimestampRef.current = timestamp;
        requestAnimationFrame(animateParticles);
        return;
      }
      const delta = Math.min(0.05, (timestamp - lastTimestampRef.current) / 1000);
      lastTimestampRef.current = timestamp;
      
      for (let p of particlesRef.current) {
        p.x += p.speedX * delta * 60;
        p.y += p.speedY * delta * 60;
        if (p.x < -50) p.x = window.innerWidth + 50;
        if (p.x > window.innerWidth + 50) p.x = -50;
        if (p.y < -50) p.y = window.innerHeight + 50;
        if (p.y > window.innerHeight + 50) p.y = -50;
      }
      requestAnimationFrame(animateParticles);
    };
    const anim = requestAnimationFrame(animateParticles);
    return () => cancelAnimationFrame(anim);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsHovering(true);
    };
    const handleMouseLeave = () => setIsHovering(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 45,
      }}
    />
  );
};
