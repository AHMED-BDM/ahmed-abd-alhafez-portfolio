import { useEffect, useState, useRef } from "react";

export const GhostManager = () => {
  const [showGhost, setShowGhost] = useState(false);
  const [ghostPos, setGhostPos] = useState({ top: 0 });
  const lastAppearance = useRef<number>(0); 
  const idleTimer = useRef<NodeJS.Timeout | null>(null); 

  const COOLDOWN = 30000; // 30 ثانية
  const IDLE_TIME = 7000; // 7 ثواني

  const summonGhost = () => {
    const now = Date.now();
    if (now - lastAppearance.current > COOLDOWN) {
      const scrollY = window.scrollY;
      const viewHeight = window.innerHeight;
      const randomY = scrollY + (Math.random() * (viewHeight - 300));
      
      setGhostPos({ top: randomY });
      setShowGhost(true);
      lastAppearance.current = now;

      document.body.classList.add("shake-screen");

      setTimeout(() => {
        setShowGhost(false);
        document.body.classList.remove("shake-screen");
      }, 1200);
    }
  };

  const resetIdleTimer = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (!showGhost) {
      idleTimer.current = setTimeout(() => {
        summonGhost();
      }, IDLE_TIME);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", resetIdleTimer);
    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("touchstart", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);

    resetIdleTimer();

    return () => {
      window.removeEventListener("scroll", resetIdleTimer);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("touchstart", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      document.body.classList.remove("shake-screen");
    };
  }, [showGhost]);

  return (
    <>
      <style>
        {`
          @keyframes ghost-dash {
            0% { transform: translateX(-100%) skewX(-30deg); opacity: 0; filter: blur(15px); }
            20% { opacity: 0.5; filter: blur(5px); }
            50% { transform: translateX(50vw) skewX(-40deg); opacity: 0.6; filter: blur(3px); }
            100% { transform: translateX(200vw) skewX(-20deg); opacity: 0; filter: blur(20px); }
          }

          @keyframes screen-earthquake {
            0%, 100% { transform: translate(0, 0); }
            10%, 30%, 50%, 70%, 90% { transform: translate(-4px, 2px); }
            20%, 40%, 60%, 80% { transform: translate(4px, -2px); }
          }

          .shake-screen {
            animation: screen-earthquake 0.5s cubic-bezier(.36,.07,.19,.97) both;
            animation-delay: 0.3s;
          }

          .ancient-ghost {
            position: absolute;
            left: 0;
            width: 250px;
            height: 400px;
            background: rgba(0, 0, 0, 0.9);
            z-index: 99999;
            pointer-events: none;
            clip-path: polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%);
            box-shadow: 0 0 100px 50px rgba(0, 0, 0, 1);
            animation: ghost-dash 1.2s linear forwards;
          }

          .ghost-eyes {
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 30px;
          }

          .ghost-eye {
            width: 6px;
            height: 6px;
            background: #ff0000;
            border-radius: 50%;
            box-shadow: 0 0 15px 5px red;
          }
        `}
      </style>

      {showGhost && (
        <div className="ancient-ghost" style={{ top: ghostPos.top }}>
          <div className="ghost-eyes">
            <div className="ghost-eye" />
            <div className="ghost-eye" />
          </div>
        </div>
      )}
    </>
  );
};
