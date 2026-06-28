

'use client';

import React from "react";
import { useSpeech } from "react-text-to-speech";

export default function App() {
  const text = "hi lal krishna";

  const { Text, speechStatus, start, pause, stop } = useSpeech({
    text,
    pitch: 1.3,
    rate: 0.8,
    volume: 1,
    lang: "en-US",
    voiceURI: "Microsoft Zira - English (United States)",
    autoPlay: false,
    highlightText: false,
    showOnlyHighlightedText: false,
    highlightMode: "sentence",
    enableDirectives: false,
  });

  return (
    <div style={{ margin: "1rem", whiteSpace: "pre-wrap" }}>
      <div
        style={{
          display: "flex",
          columnGap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <button
          disabled={speechStatus === "started"}
          onClick={start}
        >
          Start
        </button>

        <button
          disabled={speechStatus === "paused"}
          onClick={pause}
        >
          Pause
        </button>

        <button
          disabled={speechStatus === "stopped"}
          onClick={stop}
        >
          Stop
        </button>
      </div>

      <Text />
    </div>
  );
}