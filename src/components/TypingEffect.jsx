import React, { useState, useEffect } from "react";

const TypingEffect = () => {
  const [text, setText] = useState("");

  // Use a ref to keep track of the current state without triggering re-renders for logic
  // This helps avoid race conditions in the timeout loop
  const stateRef = React.useRef({
    phase: 0, // 0: type mistake, 1: delete mistake, 2: type correct, 3: wait, 4: delete all
    textLength: 0,
  });

  useEffect(() => {
    let timeoutId;

    // Constants
    const TYPING_SPEED = 150;
    const DELETING_SPEED = 100;
    const PAUSE_SHORT = 800;
    const PAUSE_LONG = 4000;

    const WORD_MISTAKE = 'const role = "Prograa";';
    const WORD_STEM = 'const role = "Progra';
    const WORD_FINAL = 'const role = "Programador";';

    const loop = () => {
      const state = stateRef.current;

      let nextDelay = TYPING_SPEED;

      if (state.phase === 0) {
        // Typing "...Prograa..."
        if (state.textLength < WORD_MISTAKE.length) {
          state.textLength++;
          setText(WORD_MISTAKE.substring(0, state.textLength));
        } else {
          state.phase = 1;
          nextDelay = PAUSE_SHORT;
        }
      } else if (state.phase === 1) {
        // Deleting
        if (state.textLength > WORD_STEM.length) {
          state.textLength--;
          setText(WORD_MISTAKE.substring(0, state.textLength));
          nextDelay = DELETING_SPEED;
        } else {
          state.phase = 2;
        }
      } else if (state.phase === 2) {
        // Typing Correct
        if (state.textLength < WORD_FINAL.length) {
          state.textLength++;
          setText(WORD_FINAL.substring(0, state.textLength));
        } else {
          state.phase = 3;
          nextDelay = PAUSE_LONG;
        }
      } else if (state.phase === 3) {
        state.phase = 4;
        nextDelay = DELETING_SPEED;
      } else if (state.phase === 4) {
        if (state.textLength > 0) {
          state.textLength--;
          setText(WORD_FINAL.substring(0, state.textLength));
          nextDelay = DELETING_SPEED;
        } else {
          state.phase = 0;
          nextDelay = 500;
        }
      }

      timeoutId = setTimeout(loop, nextDelay);
    };

    // Start the loop
    timeoutId = setTimeout(loop, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  // Simple syntax highlighter for the specific phrase
  const renderHighlightedText = (currentText) => {
    // We expect text to start with "const job = ..."
    // We can define spans for known parts
    const parts = [];
    let remaining = currentText;

    // Keyword "const"
    if (remaining.startsWith("const")) {
      const len = Math.min(5, remaining.length);
      parts.push(
        <span key="const" style={{ color: "#c678dd" }}>
          {remaining.substring(0, len)}
        </span>
      );
      remaining = remaining.substring(len);
    }

    // Space after const
    if (remaining.startsWith(" ")) {
      parts.push(<span key="sp1"> </span>);
      remaining = remaining.substring(1);
    }

    // Variable "job" (blue)
    if (
      remaining.length > 0 &&
      !remaining.startsWith("=") &&
      !remaining.startsWith('"')
    ) {
      // "job" is 3 chars.
      // Logic: grab until space or =
      const match = remaining.match(/^([a-z]+)/); // simplistic
      if (match) {
        parts.push(
          <span key="var" style={{ color: "#61afef" }}>
            {match[1]}
          </span>
        );
        remaining = remaining.substring(match[1].length);
      }
    }

    // Space and equals
    if (remaining.startsWith(" = ")) {
      parts.push(
        <span key="eq" style={{ color: "#56b6c2" }}>
          {" "}
          ={" "}
        </span>
      );
      remaining = remaining.substring(3);
    } else if (remaining.startsWith(" =")) {
      parts.push(
        <span key="eq-partial" style={{ color: "#56b6c2" }}>
          {" "}
          =
        </span>
      );
      remaining = remaining.substring(2);
    } else if (remaining.startsWith(" ")) {
      parts.push(<span key="sp2"> </span>);
      remaining = remaining.substring(1);
      if (remaining.startsWith("=")) {
        parts.push(
          <span key="eq-only" style={{ color: "#56b6c2" }}>
            =
          </span>
        );
        remaining = remaining.substring(1);
      }
    }

    // String (green)
    if (remaining.length > 0) {
      parts.push(
        <span key="string" style={{ color: "#98c379" }}>
          {remaining}
        </span>
      );
    }

    return parts;
  };

  return (
    <span
      className="notranslate"
      translate="no"
      style={{
        fontFamily: "'Fira Code', monospace", // Better coding font
        fontSize: "1.2em",
        fontWeight: "bold",
        marginLeft: "0.5rem",
        display: "inline-block",
        minWidth: "10px",
      }}
    >
      {renderHighlightedText(text)}
      <span
        className="cursor"
        style={{
          opacity: 1,
          animation: "blink 1s step-end infinite",
          color: "white",
        }}
      >
        |
      </span>
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
    </span>
  );
};

export default TypingEffect;
