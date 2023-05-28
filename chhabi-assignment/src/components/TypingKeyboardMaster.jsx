import React, {useState, useEffect, useRef } from "react";
import styles from "../styles/Keyboard.module.css";

const TypingKeyboardMaster = () => {
  const [currentI, setCurrentI] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [endTime, setEndTime] = useState(null);
  const [text, setText] = useState("");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(300);
  const [startTime, setStartTime] = useState(null);

  //for input ref
  const inputRef = useRef(null);
  const keyboardKeys = "asdfjkl;";

  useEffect(() => {
    document.addEventListener("keydown", handleDown);
    return () => {
      document.removeEventListener("keydown", handleDown);
    };
  }, []);

  // using side effects for handling timer
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer(timer - 1);
        inputRef.current.focus();
      }, 1000);
      return () => {
        clearInterval(countdown);
      };
    } else {
      setEndTime(Date.now());
      calculateAccuracy();
    }
  }, [timer]);

  const handleDown = (event) => {
    if (event.key === keyboardKeys[currentI]) {
      if (currentI === 0) {
        setStartTime(Date.now());
      }
      if (currentI === keyboardKeys.length - 1) {
        setEndTime(Date.now());
      }
      setCurrentI(currentI + 1);
    }
  };

  //for Restart Button 
  const handleRestartBotton = () => {
    setText("");
    setCurrentI(0);
    setScore(0);
    setStartTime(null);
    setEndTime(null);
    setTimer(300);
    setAccuracy(0);
  };

  const calculateAccuracy = () => {
    const typedKeys = text.slice(0, keyboardKeys.length);
    const matchedKeys = typedKeys
      .split("")
      .filter((key, index) => key === keyboardKeys[index]);
    const accuracyPercentage = (matchedKeys.length / keyboardKeys.length) * 100;
    setAccuracy(accuracyPercentage.toFixed(2));
  };

  // for Handel input change
  const handleInputChange = (event) => {
    setText(event.target.value);
    setScore(event.target.value.length);
  };

  // for timer function
  const formatTime = () => {
    const minutes = Math.floor(timer / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timer % 60).toString().padStart(2, "0");
    return `${minutes} min :${seconds} sec`;
  };

  return (
    <div className={styles.container}>
      <h1>Typing Master New Edition</h1>
      <div className={styles.keyboardKeys}>{keyboardKeys}</div>
      <input
        type="text"
        value={text}
        ref={inputRef}
        placeholder="Type the above text"
        className={styles.keyboardInput}
        onChange={handleInputChange}
        disabled={endTime !== null}
      />
      <p>Total KeyPress: {score}</p>
      {endTime ? (
        <p>
          Speed : {Math.floor(+score / 5 / 1)} WPM {"||"} Accuracy: {accuracy}%
        </p>
      ) : (
        <p>Time Left: {formatTime()}</p>
      )}
      <button onClick={handleRestartBotton}>Restart</button>
    </div>
  );
};

export default TypingKeyboardMaster;
