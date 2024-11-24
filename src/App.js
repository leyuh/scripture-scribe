import { useEffect, useState, useRef } from "react";

import Cursor from "./components/Cursor";
import Char from "./components/Char";

function App() {

  const text = "Lorem ipsum dolor sit amet dolor ipsum lorem sit amet lorem dolor amet";

  const [keysInput, setKeysInput] = useState("");
  const [activeKeyIndex, setActiveKeyIndex] = useState(0);

  const isValid = (key) => {
    let code = key.charCodeAt(0);

    return code >= 32 && code <= 126;
  }

  const handleKeyPress = (e) => {
    let key = e.key;

    console.log(key);

    if (key == "Shift") return;
 
    if (key == "Backspace") {
      setKeysInput(prev => prev.slice(0, -1));
      setActiveKeyIndex(prev => Math.max(prev - 1, 0));
      return
    }

    if (isValid(key)) { setKeysInput(prev => prev + key); setActiveKeyIndex(prev => Math.min(prev + 1, text.length))};
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);


  const getCharStatus = (i) => {
    let inputChar = keysInput.charAt(i);
    let textChar = text.charAt(i);

    if (textChar && inputChar) {
      if (textChar == inputChar) return "correct";
      if (textChar != inputChar) return "incorrect";
    }
    return "default";
  }


  useEffect(() => { console.log(keysInput.length) }, [keysInput])
  return (
    <div id="app">
      <div className="bg-secondary relative mx-auto max-w-5xl p-12 mt-20 text-zinc-100 font-semibold text-3xl rounded-md">
        <div className="words-wrapper flex flex-wrap whitespace-pre">
          {text.split("").map((char, i) => <Char
            status={getCharStatus(i)}
            letter={char}
            index={i}
            isActiveChar={i == activeKeyIndex}
            key={i}
          />)}
        </div>
        <Cursor
          i={activeKeyIndex}
        />
      </div>
    </div>
  );
}

export default App;
