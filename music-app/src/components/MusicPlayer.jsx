import { useState, useRef, useEffect } from "react";
import PlayerControls from "./PlayerControls";
import VolumeControl from "./VolumeControl";
import SeekBar from "./SeekBar";
import Equalizer from "./Equalizer";

const audioFiles = [
  { title: "F16 - The Grey Room _ Golden Palms", src: "/audio/F16 - The Grey Room _ Golden Palms.mp3" },
  { title: "Good for the Ghost - Alge", src: "/audio/good for the ghost - Alge.mp3" },
  { title: "High Noon - TrackTribe", src: "/audio/High Noon - TrackTribe.mp3" },
  { title: "In The Morning - The Grey Room _ Clark Sims", src: "/audio/In The Morning - The Grey Room _ Clark Sims.mp3" },
  { title: "Kate's Waltz - Bad Snacks", src: "/audio/Kate's Waltz - Bad Snacks.mp3" },
  { title: "Me Gustas Tu - Quincas Moreira", src: "/audio/Me Gustas Tu - Quincas Moreira.mp3" },
  { title: "The Gentlemen - DivKid", src: "/audio/The Gentlemen - DivKid.mp3" },
  { title: "The Jam - Slynk & Mr Stabalina", src: "/audio/The Jam - Slynk & Mr Stabalina.mp3" },
];

const MusicPlayer = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(new Audio(audioFiles[0].src));

  const currentSong = audioFiles[currentSongIndex];

  // --- 1. Update audio source and load only when index changes (Fix) ---
  useEffect(() => {
    const audio = audioRef.current;

    if (audio.src !== currentSong.src) {
      audio.src = currentSong.src;
      audio.load();
      // Important: When changing song, always set to play if isPlaying is true.
      // This handles the transition when clicking 'Next' while playing.
      if (isPlaying) {
        audio.play().catch(console.error);
      }
    }
    // We only depend on the song selection here, not the play/pause state.
  }, [currentSongIndex, currentSong.src]);

  // --- 2. Handle Play/Pause state change (New hook for separation) ---
  useEffect(() => {
    const audio = audioRef.current;

    // If the song is already loaded and isPlaying state changes to true, play it.
    if (isPlaying && audio.readyState >= 2) {
      audio.play().catch(console.error);
    }
    // Note: We don't need an 'else' block because audio.pause() is called in handlePlayPause.
  }, [isPlaying]);

  // --- Auto advance to next song ---
  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      // The current song has ended, move to the next.
      setCurrentSongIndex((prevIndex) => (prevIndex + 1) % audioFiles.length);
      // isPlaying should stay true to auto-play the next song
      setIsPlaying(true);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // --- Control Handlers ---
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause(); // Pauses at the current time
      setIsPlaying(false);
    } else {
      // isPlaying will become true, triggering the second useEffect to call audio.play()
      setIsPlaying(true);
    }
  };

  // ... rest of your handlers (handleStop, handleForward, etc.) are fine ...
  const handleStop = () => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  };

  const handleForward = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % audioFiles.length);
  };

  const handlePrevious = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + audioFiles.length) % audioFiles.length);
  };

  const handleShuffle = () => {
    setCurrentSongIndex((prevIndex) => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * audioFiles.length);
      } while (randomIndex === prevIndex);
      return randomIndex;
    });
  };

  return (
    <div>
      <h2 className="text-[1.2rem] text-center font-bold text-[#d9091d]">Now Playing:</h2>
      <h3
        // 1. Keep the key prop to force element replacement (CRITICAL)
        key={currentSongIndex}
        // 2. Use the new custom CSS class
        className="text-center text-[1.25rem] font-bold song-title-animate"
      >
        {currentSong.title}
      </h3>
      <p className="text-center mb-6">
        Song {currentSongIndex + 1} of {audioFiles.length}
      </p>

      <Equalizer audioRef={audioRef} />
      <SeekBar audioRef={audioRef} />
      <PlayerControls isPlaying={isPlaying} onPlayPause={handlePlayPause} onStop={handleStop} onForward={handleForward} onPrevious={handlePrevious} onShuffle={handleShuffle} />
      <VolumeControl audioRef={audioRef} />
    </div>
  );
};

export default MusicPlayer;
