import { useRef } from "react";
import { Caret } from "./Caret";
import EnsureSpaceDoesnt from "./EnsureSpaceDoesnt";
import { snapsToString, useTypingComparisonView } from "./model";
import "./styles.css";

function TypingTest() {
  const wanted = "the quick brown fox jumped over the lazy dog";
  const inputRef = useRef<HTMLDivElement>(null);
  const caretTargetRef = useRef<HTMLSpanElement>(null);
  const {
    typedWords,
    activeWord,
    wantedWords,
    typedSnaps,
    reset,
    wantedWordI,
    wantedCharI,
    handleKeyDown
  } = useTypingComparisonView(wanted, inputRef);

  return (
    <>
      <div
        className="ba tl pa1 f3 tt-input relative flex flex-wrap"
        style={{ whiteSpace: "pre-wrap" }}
        ref={inputRef}
        // tabIndex allows div to get focus
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {typedWords.map((w, i) => (
          <span key={w + i} className="ma1">
            <span className="o-50">{w}</span>
            <span>{wantedWords[i].slice(w.length)}</span>
          </span>
        ))}
        {wantedWords.slice(wantedWordI).map((w, i) =>
          i === 0 ? (
            <span key={w + i} className="ma1">
              <span className="o-50" ref={caretTargetRef}>
                {activeWord}
              </span>
              <span className="">{w.slice(wantedCharI)}</span>
            </span>
          ) : (
            <span key={w + i} className="ma1">
              {w}
            </span>
          )
        )}
        <Caret caretTargetRef={caretTargetRef} />
      </div>
      <div>{snapsToString(typedSnaps)}</div>
      <br />
      <br />
      <button onClick={reset}>Reset</button>
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
