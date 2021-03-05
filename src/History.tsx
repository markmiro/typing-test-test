import React, { useState } from "react";
import { State, Action, atHistoryIndex } from "./typingReducer";
import { Words } from "./Words";

function Slider({
  disabled,
  value,
  onChange,
  max
}: {
  disabled: boolean;
  value: number;
  onChange: (n: number) => void;
  max: number;
}) {
  const prev = () => onChange(Math.max(value - 1, 0));
  const next = () => onChange(Math.min(value + 1, max));

  return (
    <>
      <div className="flex items-center">
        <button disabled={disabled} onClick={prev}>
          ←
        </button>
        <button disabled={disabled} onClick={next}>
          →
        </button>
        <input
          disabled={disabled}
          type="range"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          max={max}
          className="w-100"
        />
      </div>
    </>
  );
}

export function History({
  initialState,
  history
}: {
  initialState: State;
  history: Action[];
}) {
  const [i, setI] = useState(0);
  const [sync, setSync] = useState(true);
  const max = history.length - 1;

  const index = sync ? max : i;

  const history$ = atHistoryIndex(initialState, history, index);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={sync}
          onChange={(e) => setSync(e.target.checked)}
        />{" "}
        Sync
      </label>
      {!sync && (
        <Slider
          disabled={history.length === 0}
          value={i}
          onChange={setI}
          max={max}
        />
      )}
      <div className="ba">
        <Words {...history$} />
      </div>
      <pre>{JSON.stringify(history[index], null, "  ")}</pre>
    </div>
  );
}
