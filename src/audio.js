export const sounds = {
  day: new Audio("/audio/LightMood.mp3"),
  night: new Audio("/audio/nightMood.mp3"),
  gate: new Audio("/audio/gate.mp3"),
  box: new Audio("/audio/box.mp3"),
  ghost: new Audio("/audio/ghost50sec.mp3"),
  whisper: new Audio("/audio/evrey30sec.mp3"),
};

// إعدادات أولية
export const setupAudio = () => {
  sounds.day.loop = true;
  sounds.night.loop = true;

  sounds.day.volume = 0.2;
  sounds.night.volume = 0.2;
};
