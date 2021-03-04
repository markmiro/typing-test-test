import { useEffect, useRef } from "react";
import EnsureSpaceDoesnt from "./EnsureSpaceDoesnt";
import { snapsToString, useTypingComparisonView } from "./model";
import "./styles.css";

function TypingTest() {
  const wanted = "the quick brown fox jumped over the lazy dog";
  const inputRef = useRef<HTMLDivElement>(null);
  const caretTargetRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);
  const {
    typedWords,
    activeWord,
    wantedWords,
    typedSnaps,
    reset,
    wantedWordI,
    wantedCharI
  } = useTypingComparisonView(wanted, inputRef);

  useEffect(() => {
    if (!caretRef.current) return;
    caretRef.current.style.opacity = caretTargetRef.current ? "1" : "0";
    caretRef.current.style.top = caretTargetRef.current?.offsetTop + "px";
    caretRef.current.style.left =
      (caretTargetRef.current?.offsetLeft || 0) +
      (caretTargetRef.current?.offsetWidth || 0) +
      "px";
    const $caret = caretRef.current;
    const id = setTimeout(() => $caret?.classList.add("tt-blink"), 700);
    return () => {
      $caret?.classList.remove("tt-blink");
      clearTimeout(id);
    };
  });

  return (
    <>
      <div
        className="ba tl pa1 f3 tt-input relative flex flex-wrap"
        style={{ whiteSpace: "pre-wrap" }}
        ref={inputRef}
      >
        {typedWords.map((w, i) => (
          <span className="ma1">
            <span className="o-50">{w}</span>
            <span>{wantedWords[i].slice(w.length)}</span>
          </span>
        ))}
        {wantedWords.slice(wantedWordI).map((w, i) =>
          i === 0 ? (
            <span className="ma1">
              <span className="o-50" ref={caretTargetRef}>
                {activeWord}
              </span>
              <span className="">{w.slice(wantedCharI)}</span>
            </span>
          ) : (
            <span className="ma1">{w}</span>
          )
        )}
        <div
          ref={caretRef}
          className="tt-blink-none"
          style={{
            position: "absolute",
            borderRight: "0.1em solid black",
            height: "1em",
            transitionProperty: "left, top, opacity",
            transitionDuration: "80ms",
            transitionTimingFunction: "ease-out"
          }}
        />
      </div>
      <div>{snapsToString(typedSnaps)}</div>
      <button onClick={reset}>Reset</button>
      <div>
        <pre>
          {JSON.stringify(
            {
              wantedWordI,
              wantedCharI,
              offsetWidth:
                (caretTargetRef.current?.offsetLeft || 0) +
                (caretTargetRef.current?.offsetWidth || 0)
            },
            null,
            "  "
          )}
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
