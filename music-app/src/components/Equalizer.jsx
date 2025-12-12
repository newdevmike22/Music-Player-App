import React, { useEffect, useRef } from "react";

const Equalizer = ({ audioRef }) => {
  const barsRef = useRef([]);
  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!audioRef?.current) return;

    const audio = audioRef.current;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const audioCtx = audioCtxRef.current;

    if (!analyserRef.current) {
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.75;
      analyserRef.current = analyser;
    }
    const analyser = analyserRef.current;

    if (!sourceRef.current) {
      try {
        const source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        sourceRef.current = source;
      } catch (e) {
        console.warn("MediaElementSource already exists; skipping");
      }
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    // 🎨 SOLID RAINBOW COLOR — NO WHITE
    const getColor = (value, index, total) => {
      const hue = Math.floor((index / total) * 360);
      return `hsl(${hue}, 100%, 50%)`;
    };

    const animate = () => {
      analyser.getByteFrequencyData(dataArray);

      barsRef.current.forEach((bar, i) => {
        if (!bar || i >= bufferLength) return;

        const value = dataArray[i];
        const height = Math.max(4, (value / 255) * 60);

        bar.style.height = `${height}px`;
        bar.style.backgroundColor = getColor(value, i, bufferLength);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    const start = async () => {
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }
      animate();
    };

    const stop = () => {
      cancelAnimationFrame(animationRef.current);
      barsRef.current.forEach((bar) => {
        if (bar) bar.style.height = "4px";
      });
    };

    if (!audio.paused && audio.readyState >= 3) {
      start();
    }

    audio.addEventListener("play", start);
    audio.addEventListener("pause", stop);
    audio.addEventListener("ended", stop);

    return () => {
      audio.removeEventListener("play", start);
      audio.removeEventListener("pause", stop);
      audio.removeEventListener("ended", stop);
      cancelAnimationFrame(animationRef.current);
    };
  }, [audioRef]);

  return (
    <div className="flex items-end justify-center gap-1 h-16 mt-4">
      {Array.from({ length: 32 }).map((_, i) => (
        <div key={i} ref={(el) => (barsRef.current[i] = el)} className="w-[4px] rounded-sm transition-all duration-50" style={{ height: "4px" }} />
      ))}
    </div>
  );
};

export default Equalizer;
