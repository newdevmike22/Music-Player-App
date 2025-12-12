import MusicPlayer from "./components/MusicPlayer";
import AfroDJ from "/images/afro-dj-woman-art.webp";
import { motion } from "framer-motion";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-4 my-8 mx-auto">
      <motion.img
        src={AfroDJ}
        alt=""
        className="w-88 sm:w-110 md:w-132 h-auto mb-6"
        animate={{
          scale: [1, 1.03, 1],
          //rotate: [0, 1, -1, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <MusicPlayer />
    </div>
  );
};

export default App;
