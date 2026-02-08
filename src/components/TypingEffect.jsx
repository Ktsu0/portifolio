import React, { useState, useEffect } from "react";

const TypingEffect = () => {
  const [text, setText] = useState("");

  const stateRef = React.useRef({
    phraseIndex: 0,
    isDeleting: false,
    textLength: 0,
  });

  useEffect(() => {
    let timeoutId;

    const TYPING_SPEED = 100;
    const DELETING_SPEED = 75;
    const PAUSE_AFTER_TYPING = 2000;
    const PAUSE_AFTER_DELETING = 500;

    const phrases = [
      'console.log("Hello World!");',
      'console.log("Welcome");',
      'const role = "Programador";',
    ];

    const loop = () => {
      const state = stateRef.current;
      const currentPhrase = phrases[state.phraseIndex];

      let nextDelay = TYPING_SPEED;

      if (!state.isDeleting) {
        if (state.textLength < currentPhrase.length) {
          state.textLength++;
          setText(currentPhrase.substring(0, state.textLength));
          nextDelay = TYPING_SPEED;
        } else {
          state.isDeleting = true;
          nextDelay = PAUSE_AFTER_TYPING;
        }
      } else {
        if (state.textLength > 0) {
          state.textLength--;
          setText(currentPhrase.substring(0, state.textLength));
          nextDelay = DELETING_SPEED;
        } else {
          state.isDeleting = false;
          state.phraseIndex = (state.phraseIndex + 1) % phrases.length;
          nextDelay = PAUSE_AFTER_DELETING;
        }
      }

      timeoutId = setTimeout(loop, nextDelay);
    };

    timeoutId = setTimeout(loop, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  const renderHighlightedText = (currentText) => {
    const parts = [];
    let remaining = currentText;

    if (remaining.startsWith("console")) {
      const consoleMatch = remaining.match(/^(console)/);
      if (consoleMatch) {
        parts.push(
          <span key="console" style={{ color: "#61afef" }}>
            {consoleMatch[1]}
          </span>,
        );
        remaining = remaining.substring(consoleMatch[1].length);
      }

      if (remaining.startsWith(".")) {
        parts.push(
          <span key="dot1" style={{ color: "#abb2bf" }}>
            .
          </span>,
        );
        remaining = remaining.substring(1);
      }

      if (remaining.startsWith("log")) {
        const logMatch = remaining.match(/^(log)/);
        if (logMatch) {
          parts.push(
            <span key="log" style={{ color: "#61afef" }}>
              {logMatch[1]}
            </span>,
          );
          remaining = remaining.substring(logMatch[1].length);
        }
      }

      if (remaining.startsWith("(")) {
        parts.push(
          <span key="paren1" style={{ color: "#abb2bf" }}>
            (
          </span>,
        );
        remaining = remaining.substring(1);
      }

      const stringMatch = remaining.match(/^("[^"]*"?)/);
      if (stringMatch) {
        parts.push(
          <span key="string" style={{ color: "#98c379" }}>
            {stringMatch[1]}
          </span>,
        );
        remaining = remaining.substring(stringMatch[1].length);
      }

      if (remaining.startsWith(")")) {
        parts.push(
          <span key="paren2" style={{ color: "#abb2bf" }}>
            )
          </span>,
        );
        remaining = remaining.substring(1);
      }

      if (remaining.startsWith(";")) {
        parts.push(
          <span key="semi" style={{ color: "#abb2bf" }}>
            ;
          </span>,
        );
        remaining = remaining.substring(1);
      }
    } else if (remaining.startsWith("const")) {
      const len = Math.min(5, remaining.length);
      parts.push(
        <span key="const" style={{ color: "#c678dd" }}>
          {remaining.substring(0, len)}
        </span>,
      );
      remaining = remaining.substring(len);

      if (remaining.startsWith(" ")) {
        parts.push(<span key="sp1"> </span>);
        remaining = remaining.substring(1);
      }

      const varMatch = remaining.match(/^([a-zA-Z_][a-zA-Z0-9_]*)/);
      if (varMatch) {
        parts.push(
          <span key="var" style={{ color: "#e06c75" }}>
            {varMatch[1]}
          </span>,
        );
        remaining = remaining.substring(varMatch[1].length);
      }

      if (remaining.startsWith(" = ")) {
        parts.push(
          <span key="eq" style={{ color: "#56b6c2" }}>
            {" "}
            ={" "}
          </span>,
        );
        remaining = remaining.substring(3);
      } else if (remaining.startsWith(" =")) {
        parts.push(
          <span key="eq-partial" style={{ color: "#56b6c2" }}>
            {" "}
            =
          </span>,
        );
        remaining = remaining.substring(2);
      } else if (remaining.startsWith(" ")) {
        parts.push(<span key="sp2"> </span>);
        remaining = remaining.substring(1);
        if (remaining.startsWith("=")) {
          parts.push(
            <span key="eq-only" style={{ color: "#56b6c2" }}>
              =
            </span>,
          );
          remaining = remaining.substring(1);
        }
      }

      const stringMatch = remaining.match(/^("[^"]*"?)/);
      if (stringMatch) {
        parts.push(
          <span key="string" style={{ color: "#98c379" }}>
            {stringMatch[1]}
          </span>,
        );
        remaining = remaining.substring(stringMatch[1].length);
      }

      if (remaining.startsWith(";")) {
        parts.push(
          <span key="semi" style={{ color: "#abb2bf" }}>
            ;
          </span>,
        );
        remaining = remaining.substring(1);
      }
    }

    if (remaining.length > 0) {
      parts.push(
        <span key="remaining" style={{ color: "#abb2bf" }}>
          {remaining}
        </span>,
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
