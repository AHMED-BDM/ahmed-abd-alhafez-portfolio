export const sounds = {
  day: new Audio("/audio/LightMood.mp3"),
  night: new Audio("/audio/nightMood.mp3"),
  gate: new Audio("/audio/gate.mp3"),
  box: new Audio("/audio/box.mp3"),
  ghost: new Audio("/audio/ghost50sec.mp3"),
  whisper: new Audio("/audio/evrey30sec.mp3"),
  iseeyou: new Audio("/audio/IseeYouVoice.m4a"), 
  // ✅ إضافة الملفات الجديدة
  ancient: new Audio("/audio/Ancient-Egyptian-Language.mp3"),
  explosion: new Audio("/audio/EXPLOSION.mp3"),
};

// إعدادات أولية
export const setupAudio = () => {
  sounds.day.loop = true;
  sounds.night.loop = true;

  sounds.day.volume = 0.2;
  sounds.night.volume = 0.2;
  
  sounds.iseeyou.volume = 0.8; 
  // ✅ ضبط مستوى صوت الملفات الجديدة (تقدر تعدل الأرقام دي براحتك من 0.0 لـ 1.0)
  sounds.ancient.volume = 0.85;
  sounds.explosion.volume = 1.0; 
};
