import { useState } from "react";
import { MdVolumeUp, MdVolumeOff } from "react-icons/md";

const VolumeControl = ({ audioRef }) => {
  const [volume, setVolume] = useState(1);
  const [lastVolume, setLastVolume] = useState(1);

  const handleVolumeChange = (value) => {
    setVolume(value);

    if (audioRef?.current) {
      audioRef.current.volume = value;
    }
  };

  const handleToggleMute = () => {
    if (!audioRef?.current) return;

    if (volume === 0) {
      setVolume(lastVolume);
      audioRef.current.volume = lastVolume;
    } else {
      setLastVolume(volume);
      setVolume(0);
      audioRef.current.volume = 0;
    }
  };

  return (
    <div className="flex items-center gap-3 mt-4 justify-center">
      <button type="button" onClick={handleToggleMute} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition" aria-label="Mute / Unmute">
        {volume === 0 ? <MdVolumeOff size={28} /> : <MdVolumeUp size={28} />}
      </button>

      <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => handleVolumeChange(parseFloat(e.target.value))} className="w-40 accent-blue-600" />
    </div>
  );
};

export default VolumeControl;
