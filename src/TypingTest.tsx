import React, { RefObject, useReducer, useRef } from "react";
import { History } from "./History";
import { Action, initialState, typingReducer } from "./typingReducer";
import { isKeyAllowed } from "./typingUtils";
import { Words } from "./Words";

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
  const initialState2 = {
    ...initialState,
    wantedWords: wanted.split(" ")
  };
  const [$, dispatch] = useReducer(typingReducer, initialState2);
  const { handleReset, handleKeyDown } = useTypingKeys({ dispatch, inputRef });

  return (
    <div className="flex flex-column">
      <div
        // tabIndex allows div to get focus
        tabIndex={0}
        ref={inputRef}
        className="ba pa2 f3 tt-input"
        onKeyDown={handleKeyDown}
      >
        <Words {...$} />
      </div>
      <button onClick={handleReset}>Reset</button>

      <h2>History</h2>
      <History initialState={initialState2} history={$.history} />
    </div>
  );
}
