import React, { useState } from "react";
import { typed, State, Action, atHistoryIndex } from "./typingReducer";

export function History({
  initialState,
  history
}: {
  initialState: State;
  history: Action[];
}) {
  const [i, setI] = useState(0);

  const history$ = atHistoryIndex(initialState, history, i);

  return (
    <div>
      <input
        disabled={history.length === 0}
        type="range"
        value={i}
        onChange={(e) => setI(parseInt(e.target.value, 10))}
        max={history.length - 1}
        className="w-100"
      />
      <div>{typed(history$) || "N/A"}</div>
    </div>
  );
}
