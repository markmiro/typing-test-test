import React, { RefObject, useReducer, useRef } from "react";
import { Caret } from "./Caret";
import { History } from "./History";
import { Action, initialState, typingReducer } from "./typingReducer";
import { isKeyAllowed } from "./typingUtils";

function useTypingKeys({
  dispatch,
  inputRef
}: {
  dispatch: React.Dispatch<Action>;
  inputRef: RefObject<HTMLDivElement>;
}) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!isKeyAllowed(e.key)) return;
    // Prevent scrolling when pressing space
    if (e.key === " ") e.preventDefault();

    const ts = e.timeStamp;
    switch (e.key) {
      case "Backspace":
        // CTRL is for Windows OS
        if (e.altKey || e.ctrlKey) {
          dispatch({ type: "DELETE_WORD", ts });
        } else {
          dispatch({ type: "DELETE_CHAR", ts });
        }
        break;
      default:
        if (e.key === " ") {
          dispatch({ type: "ADD_SPACE", ts });
        } else {
          dispatch({ type: "ADD_CHAR", char: e.key, ts });
        }
        break;
    }
  }

  function handleReset() {
    dispatch({ type: "RESET" });
    inputRef.current?.focus();
  }

  return { handleKeyDown, handleReset };
}

export function TypingTest() {
  const wanted = "the quick brown fox jumped over the lazy dog";
  const inputRef = useRef<HTMLDivElement>(null);
  const caretTargetRef = useRef<HTMLSpanElement>(null);
  const initialState2 = {
    ...initialState,
    wantedWords: wanted.split(" ")
  };
  const [$, dispatch] = useReducer(typingReducer, initialState2);
  const { handleReset, handleKeyDown } = useTypingKeys({ dispatch, inputRef });

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
        {$.typedWords.map((w, i) => (
          <span key={w + i} className="ma1">
            <span className="o-50">{w}</span>
            <span>{$.wantedWords[i].slice(w.length)}</span>
          </span>
        ))}
        {$.wantedWords.slice($.wantedWordI).map((w, i) =>
          i === 0 ? (
            <span key={w + i} className="ma1">
              <span className="o-50" ref={caretTargetRef}>
                {$.activeWord}
              </span>
              <span className="">{w.slice($.wantedCharI)}</span>
            </span>
          ) : (
            <span key={w + i} className="ma1">
              {w}
            </span>
          )
        )}
        <Caret caretTargetRef={caretTargetRef} />
      </div>
      <br />
      <button onClick={handleReset}>Reset</button>
      <br />
      <br />
      <History initialState={initialState2} history={$.history} />
    </>
  );
}
