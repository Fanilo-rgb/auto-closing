import React, { useEffect, useState } from "react";

const FocusModeButton: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
      (element as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
    } else if ((element as unknown as { msRequestFullscreen?: () => void }).msRequestFullscreen) {
      (element as unknown as { msRequestFullscreen: () => void }).msRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
      (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
    } else if ((document as unknown as { msExitFullscreen?: () => void }).msExitFullscreen) {
      (document as unknown as { msExitFullscreen: () => void }).msExitFullscreen();
    }
  };

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleChange);
    document.addEventListener("webkitfullscreenchange", handleChange as EventListener);
    document.addEventListener("msfullscreenchange", handleChange as EventListener);

    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      document.removeEventListener("webkitfullscreenchange", handleChange as EventListener);
      document.removeEventListener("msfullscreenchange", handleChange as EventListener);
    };
  }, []);

  return (
    <div className="flex gap-4">
      {!isFullscreen ? (
        <button
          onClick={enterFullscreen}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          🎯 Mode 0 distraction
        </button>
      ) : (
        <button
          onClick={exitFullscreen}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          ❌ Quitter 0 distraction
        </button>
      )}
    </div>
  );
};

export default FocusModeButton;
