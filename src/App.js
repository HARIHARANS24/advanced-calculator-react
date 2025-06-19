import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import "./styles.css";

const buttons = [
  "7", "8", "9", "/",
  "4", "5", "6", "*",
  "1", "2", "3", "-",
  "0", ".", "=", "+",
  "C", "(", ")", "√",
  "sin", "cos", "tan", "log",
  "copy", "sci", "mic", "convert",
  "unit"
];

const unitConversions = [
  { label: "m → cm", factor: 100 },
  { label: "kg → g", factor: 1000 },
  { label: "cm → m", factor: 0.01 },
  { label: "g → kg", factor: 0.001 },
];

export default function CalculatorApp() {
  const [expression, setExpression] = useState("");
  const [theme, setTheme] = useState("light");
  const [history, setHistory] = useState([]);
  const [sciNotation, setSciNotation] = useState(false);
  const [unitIndex, setUnitIndex] = useState(0);
  const inputRef = useRef(null);

  const handleClick = (value) => {
    if (value === "C") {
      setExpression("");
    } else if (value === "=") {
      try {
        const expr = expression
          .replace(/\u221a/g, "Math.sqrt")
          .replace(/sin/g, "Math.sin")
          .replace(/cos/g, "Math.cos")
          .replace(/tan/g, "Math.tan")
          .replace(/log/g, "Math.log10");
        let result = eval(expr);
        if (sciNotation) result = result.toExponential();
        setExpression(result.toString());
        setHistory([`${expression} = ${result}`, ...history]);
      } catch {
        setExpression("Error");
      }
    } else if (value === "copy") {
      navigator.clipboard.writeText(expression);
    } else if (value === "mic") {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.onresult = (event) => {
        const voiceInput = event.results[0][0].transcript;
        setExpression(expression + voiceInput);
      };
      recognition.start();
    } else if (value === "sci") {
      setSciNotation(!sciNotation);
    } else if (value === "unit") {
      setUnitIndex((unitIndex + 1) % unitConversions.length);
    } else if (value === "convert") {
      try {
        let result = parseFloat(expression);
        if (isNaN(result)) throw new Error();
        result *= unitConversions[unitIndex].factor;
        setExpression(result.toString());
        setHistory([`Converted (${unitConversions[unitIndex].label}): ${result}`, ...history]);
      } catch {
        setExpression("Error");
      }
    } else {
      setExpression(expression + value);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`app-container ${theme}`}>
      <div className="history-box">
        <h3>History</h3>
        <ul>
          {history.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div className={`calculator ${theme}`}>
        <div className="top-bar">
          <h2>Advanced Calculator</h2>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
        <motion.input
          className="display"
          ref={inputRef}
          value={expression}
          readOnly
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        <div className="unit-label">
          Unit Mode: {unitConversions[unitIndex].label}
        </div>
        <div className="buttons">
          {buttons.map((btn) => (
            <button key={btn} onClick={() => handleClick(btn)}>
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
