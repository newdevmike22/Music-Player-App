import { useState, useEffect } from "react";

const SeekBar = ({ audioRef }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // update time + duration from audio element
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [audioRef]);

  // called when user drags slider
  const handleSeek = (value) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const formatTime = (t) => (isNaN(t) ? "0:00" : `${Math.floor(t / 60)}:${("0" + Math.floor(t % 60)).slice(-2)}`);

  return (
    <div className="mt-4 w-full text-center">
      <input type="range" min="0" max={duration} value={currentTime} step="0.1" onChange={(e) => handleSeek(parseFloat(e.target.value))} className="w-full accent-blue-500" />

      <div className="flex justify-between mt-1 text-sm text-gray-600 dark:text-gray-300">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default SeekBar;
