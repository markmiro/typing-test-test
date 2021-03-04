import { useRef } from "react";
import EnsureSpaceDoesnt from "./EnsureSpaceDoesnt";
import { snapsToString, useTypingComparisonView } from "./model";
import "./styles.css";

function TypingTest() {
  const wanted = "the quick brown fox jumped over the lazy dog";
  const inputRef = useRef<HTMLDivElement>(null);
  const {
    typed,
    typedSnaps,
    toType,
    reset,
    wantedWordI,
    wantedCharI
  } = useTypingComparisonView(wanted, inputRef);

  return (
    <>
      <div
        className="ba tl pa1 f3 tt-input"
        style={{ whiteSpace: "pre" }}
        ref={inputRef}
      >
        <span style={{ opacity: 0.4, position: "relative" }}>{typed}</span>
        <span className="tt-ibeam">{toType}</span>
      </div>
      <div>{snapsToString(typedSnaps)}</div>
      <button onClick={reset}>Reset</button>
      <div>
        <pre>
          {JSON.stringify({ typedSnaps, wantedWordI, wantedCharI }, null, "  ")}
        </pre>
      </div>
    </>
  );
}

export default function App() {
  return (
    <div className="sans-serif pa2">
      <h1>Typing Test</h1>
      <TypingTest />
      <EnsureSpaceDoesnt />
    </div>
  );
}
