import { useEffect, useState, useRef } from "react";

import Char from "./components/Char";

function App() {

  const [keysInput, setKeysInput] = useState("");
  const [activeKeyIndex, setActiveKeyIndex] = useState(0);

  const [ogText, setOgText] = useState("");
  const [textData, setTextData] = useState("");
  const [reference, setReference] = useState("");

  const [isScramble, setIsScramble] = useState(false);

  const [showCompletion, setShowCompletion] = useState(false);
  const [showReferenceInput, setShowReferenceInput] = useState(false);

  const [start, setStart] = useState(false);
  const [time, setTime] = useState(0);

  const refRef = useRef();

  const isValid = (key) => {
    let code = key.charCodeAt(0);

    return code >= 32 && code <= 126;
  }

  const isValidScramble = (key) => {
    let code = key.toLowerCase().charCodeAt(0);
    return (code == 32) || (code >= 61 && code <= 122);
  }

  const handleKeyPress = (e) => {
    if (document.activeElement === refRef.current && showReferenceInput) return;
    let key = e.key;

    if (key == "Shift" || key == "Enter") return;

    if (!start && !showCompletion) setStart(true);
 
    if (key == "Backspace") {
      setKeysInput(prev => prev.slice(0, -1));
      setActiveKeyIndex(prev => Math.max(prev - 1, 0));
    } else if (isValid(key)) {
      setKeysInput(prev => prev + key);
      setActiveKeyIndex(prev => Math.min(prev + 1, textData.length))
    };
  }

  useEffect(() => {
    if (textData.length) {
      if (activeKeyIndex == textData.length) {
        setStart(false);
        setShowCompletion(true);
      };
    }
  }, [activeKeyIndex])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    let interval;

    if (start) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000)
    }

    return () => {
      clearInterval(interval);
    }
  }, [start])

  const getRandomVerse = async (scrambled=false) => {
    let res = await fetch("https://bible-api.com/?random=verse")
      .then(res => res.json());

    let text = scrambled ? res.text.split(" ").sort((a, b) => Math.floor(Math.random()*2) - 1).join(" ").split("").filter(char => isValidScramble(char)).map(char => char == "\n" ? " " : char).join("") : res.text.split("").map(char => (char.charCodeAt(0) == 8217 || char.charCodeAt(0) == 8216) ? "'" : (char.charCodeAt(0) == 8220 || char.charCodeAt(0) == 8221) ? '"' : char == "\n" ? " " : char).join("");
    text = text.split("").filter((char, i) => ((i == 0 || i == text.length - 1) && char != " ") || (i != 0 && i != text.length - 1)).join("");
    setOgText(res.text);
    setTextData(text);
    setReference(res.reference);
  }


  useEffect(() => {
    setKeysInput("");
    setActiveKeyIndex(0);
    getRandomVerse(isScramble);
  }, [isScramble])

  const getAccuracy = () => {
    let input = keysInput;
    let actual = textData;

    let possibleScore = textData.length;
    let score = 0;

    for (let i = 0; i < possibleScore; i++) {
      if (input[i] == actual[i]) score++;
    }

    return Math.ceil(score/possibleScore*100);
  }


  const getCharStatus = (i) => {
    let inputChar = keysInput.charAt(i);
    let textChar = textData.charAt(i);

    if (textChar && inputChar) {
      if (textChar == inputChar) return "correct";
      if (textChar != inputChar) return "incorrect";
    }
    return "default";
  }

  const handleRefSubmit = async (e) => {
    e.preventDefault();

    let input = e.target.ref.value;

    let res = await fetch(`https://bible-api.com/${input.toLowerCase()}`)
      .then(res => res.json());

    e.target.ref.blur();

    if (res.error) return;

    let text = res.text.split("").map(char => (char.charCodeAt(0) == 8217 || char.charCodeAt(0) == 8216) ? "'" : (char.charCodeAt(0) == 8220 || char.charCodeAt(0) == 8221) ? '"' : char == "\n" ? " " : char).join("");
    text = text.split("").filter((char, i) => ((i == 0 || i == text.length - 1) && char != " ") || (i != 0 && i != text.length - 1)).join("");

    setStart(false);
    setTime(0);
    setKeysInput("");
    setActiveKeyIndex(0);

    setOgText(res.text);
    setTextData(text);
    setReference(res.reference);

  }

  return (
    <div id="app">
      <h1 className="text-zinc-100 text-3xl text-center mt-4 tracking-wide">&lt;scripture scribe/&gt;</h1>
      <div className="bg-secondary mx-auto mt-[15vh] max-w-md rounded-md text-zinc-100 px-4 py-2 flex gap-4 justify-start">
        <button
          className={`${showReferenceInput ? "border-2 border-zinc-100" : ""} px-2 py-1 rounded-sm hover:bg-zinc-100 hover:text-primary transition-all`}
          onClick={() => setShowReferenceInput(prev => !prev)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
        </button>
        <button
          className={`${!isScramble ? "border-2 border-zinc-100" : ""} px-2 py-1 rounded-sm hover:bg-zinc-100 hover:text-primary transition-all`}
          onClick={() => setIsScramble(false)}
        >Verse</button>
        <button
          className={`${isScramble ? "border-2 border-zinc-100" : ""} px-2 py-1 rounded-sm hover:bg-zinc-100 hover:text-primary transition-all`}
          onClick={() => setIsScramble(true)}
        >Scramble</button>

        {showReferenceInput && <form onSubmit={handleRefSubmit}>
          <input
            ref={refRef}
            name="ref"
            className="px-2 py-1 rounded-sm text-zinc-100 border-2 outline-none border-zinc-100 transition-all bg-transparent"
            placeholder="John 3:16"
          />
        </form>}
      </div>

      <div className="bg-secondary relative mx-auto max-w-5xl p-12 mt-20 text-zinc-100 font-semibold text-3xl rounded-md">
        <div className="words-wrapper flex flex-wrap whitespace-pre">
          {textData.split("").map((char, i) => <Char
            status={getCharStatus(i)}
            letter={char}
            index={i}
            isActiveChar={i == activeKeyIndex}
            key={i}
          />)}
        </div>

      </div>

      {showCompletion &&
        <div className="fixed w-full h-full top-0 left-0 bg-black bg-opacity-[90%] flex items-center justify-center">
          <div className="bg-secondary px-4 py-6 max-w-md text-zinc-100">
            <h1 className="text-center text-3xl mt-4">{reference}</h1>
            <p className="text-center text-lg mt-2">{ogText}</p>

            <div className="flex gap-6 text-lg justify-center items-center mt-8">
                <div className="flex flex-col items-center justify-center">
                    <p className="font-bold text-3xl">{Math.round((textData.length / 5) / (time/60))}</p>
                    <h3>wpm</h3>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <p className="font-bold text-3xl">{getAccuracy()}%</p>
                    <h3>accuracy</h3>
                </div>
            </div>

            <div className="flex gap-6 items-center justify-center mt-2">
                <button className="border-2 border-zinc-100 px-2 py-1 rounded-sm hover:bg-zinc-100 hover:text-primary transition-all" onClick={() => {
                  setKeysInput("");
                  setActiveKeyIndex(0);
                  setShowCompletion(false);
                }}>Repeat test</button>
                <button className="border-2 border-zinc-100 px-2 py-1 rounded-sm hover:bg-zinc-100 hover:text-primary transition-all" onClick={() => {
                  window.location.reload();
                }}>New test</button>
            </div>
            
        </div>
      </div>}
    </div>
  );
}

export default App;
