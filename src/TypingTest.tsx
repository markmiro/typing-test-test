import { useReducer, useRef } from "react";
import { History } from "./History";
import { initialState, typingReducer } from "./typingReducer";
import { useTypingKeys } from "./useTypingKeys";
import { Words } from "./Words";

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
