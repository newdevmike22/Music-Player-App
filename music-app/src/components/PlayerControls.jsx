import { MdPlayArrow, MdPause, MdStop, MdSkipNext, MdSkipPrevious, MdShuffle } from "react-icons/md";

const PlayerControls = ({ isPlaying, onPlayPause, onStop, onForward, onPrevious, onShuffle }) => {
  return (
    <div className="flex items-center justify-center gap-4">
      {/* Previous Button */}
      <button type="button" onClick={onPrevious} title="Previous Song" aria-label="Previous Song" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
        <MdSkipPrevious size={30} />
      </button>

      {/* Stop Button */}
      <button type="button" onClick={onStop} title="Stop" aria-label="Stop" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
        <MdStop size={30} />
      </button>

      {/* Play / Pause */}
      <button type="button" onClick={onPlayPause} title={isPlaying ? "Pause" : "Play"} aria-label={isPlaying ? "Pause" : "Play"} className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition">
        {isPlaying ? <MdPause size={34} /> : <MdPlayArrow size={34} />}
      </button>

      {/* Forward Button */}
      <button type="button" onClick={onForward} title="Next Song" aria-label="Next Song" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
        <MdSkipNext size={30} />
      </button>

      {/* Shuffle Button */}
      <button type="button" onClick={onShuffle} title="Shuffle" aria-label="Shuffle" className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
        <MdShuffle size={30} />
      </button>
    </div>
  );
};

export default PlayerControls;
