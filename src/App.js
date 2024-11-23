import { useEffect, useState, useRef } from "react";

import Char from "./components/Char";

function App() {

  const text = "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet";

  const [keysInput, setKeysInput] = useState("");


  const handleKeyPress = (e) => {
    console.log(e.key);
    if (e.key == "Backspace") {
      if (!keysInput.length) return;
      setKeysInput(prev => prev.slice(0, -1));
      return
    }

    setKeysInput(prev => prev + e.key);
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);


  const getCharStatus = (wordIndex, letterIndex) => {
    return "default";
  }

  return (
    <div id="app">
      <div className="bg-secondary mx-auto max-w-5xl p-12 mt-20 text-zinc-100 font-semibold text-3xl tracking-wider rounded-md">
        <div className="words-wrapper flex flex-wrap">
          {text.split(" ").map((word, i) => <span key={i} className="mx-1">
            {word.split("").map((letter, j) => <Char 
              status={getCharStatus(i, j)}
              letter={letter}
              wordIndex={i}
              letterIndex={j}
              key={j}
            />)}
          </span>)}
        </div>
        
      </div>
    </div>
  );
}

export default App;
