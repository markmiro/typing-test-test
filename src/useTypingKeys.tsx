import React, { RefObject } from "react";
import { Action } from "./typingReducer";
import { isKeyAllowed } from "./isKeyAllowed";

export function useTypingKeys({
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
          // Pressing CMD-R to refresh page, for example, shouldn't cause anything to get typed
          if (!e.altKey && !e.ctrlKey && !e.metaKey) {
            dispatch({ type: "ADD_CHAR", char: e.key, ts });
          }
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
