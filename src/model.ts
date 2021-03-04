import { RefObject, useEffect, useMemo, useState } from "react";

type Snap = {
  ts: number;
  char?: string;
  wantedChar?: string;
  del?: number;
  wantedWordI?: number;
  wantedCharI?: number;
};

export function snapsToString(snaps: Snap[]) {
  let output = "";

  snaps.forEach((snap, i) => {
    if (snap.char) {
      output += snap.char;
    } else if (snap.del) {
      output = output.slice(0, -snap.del);
    }
  });

  return output;
}

function isKeyAllowed(key: string) {
  // http://www.asciitable.com/ (valid keys between 32 and 126)
  const keyWithinRange =
    key.length === 1 && key.charCodeAt(0) >= 32 && key.charCodeAt(0) <= 126;
  const isBackspace = key === "Backspace";
  return isBackspace || keyWithinRange;
}

function useTypingComparison(wanted: string) {
  const [typedSnaps, setTypedSnaps] = useState<Snap[]>([]);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [activeWord, setActiveWord] = useState("");
  const wantedWords = useMemo(() => wanted.split(" "), [wanted]);
  const [wantedWordI, setWantedWordI] = useState(0);
  const [wantedCharI, setWantedCharI] = useState(0);
  const wantedWord = wantedWords[wantedWordI];

  function addSnap(snap: Snap) {
    setTypedSnaps((s) => [...s, snap]);
  }

  function deleteChar(ts: number) {
    addSnap({ del: 1, ts });
    if (activeWord.length > wantedWord.length) {
      setActiveWord((w) => w.slice(0, -1));
    } else {
      const deletingSpace = activeWord.length === 0 && wantedWordI > 0;
      if (deletingSpace) {
        const newWordI = wantedWordI - 1;
        const lastTypedWord = typedWords[typedWords.length - 1];
        setTypedWords((w) => w.slice(0, -1)); // Delete last word
        setActiveWord(lastTypedWord); // Set old typed word to active word
        setWantedWordI(newWordI);
        setWantedCharI(lastTypedWord.length);
      } else {
        setActiveWord((w) => w.slice(0, -1));
        setWantedCharI((i) => Math.max(0, i - 1));
      }
    }
  }

  function deleteWord(ts: number) {
    // Beginning of word
    if (wantedCharI === 0) {
      // Delete space and word
      const lastTypedWord = typedWords[typedWords.length - 1];
      if (lastTypedWord) {
        addSnap({
          del: lastTypedWord.length + 1,
          ts
        });
        setActiveWord("");
        setTypedWords((w) =>
          // Remove last word
          w.slice(0, -1)
        );
        setWantedWordI((i) => Math.max(0, i - 1));
        setWantedCharI(0);
      }
    } else {
      addSnap({
        del: activeWord.length,
        ts
      });
      setActiveWord("");
      setWantedCharI(0);
    }
  }

  function space(ts: number) {
    // If pressing space while at the beginning of a word, then likely it's a mistake
    const notDoubleSpace = activeWord !== "";
    // While not one last word
    const whileWordIsInBounds = wantedWordI < wantedWords.length - 1;
    if (whileWordIsInBounds && notDoubleSpace) {
      addSnap({
        char: " ",
        ts
      });
      setTypedWords((w) => [...w, activeWord]);
      setActiveWord("");
      setWantedCharI(0);
      setWantedWordI((w) => w + 1);
    }
  }

  function char(char: string, ts: number) {
    addSnap({
      char,
      ts
    });
    setActiveWord(activeWord + char);
    // While not on last wanted char, keep updating wanted char
    // Otherwise, don't move on to next word or anything
    // TODO: consider having a clamp elswewhere so wantedCharI can be out of bounds
    if (wantedCharI < wantedWord.length) {
      setWantedCharI((c) => c + 1);
    }
  }

  function reset() {
    setTypedWords([]);
    setActiveWord("");
    setWantedCharI(0);
    setWantedWordI(0);
    setTypedSnaps([]);
  }

  const toType = () =>
    wantedWords.slice(wantedWordI).join(" ").slice(wantedCharI);

  return {
    typed: () => [...typedWords, activeWord].join(" "),
    typedWords,
    activeWord,
    wantedWords,
    typedSnaps,
    toType,
    deleteChar,
    deleteWord,
    space,
    char,
    reset,
    // Other...
    wantedWordI,
    wantedCharI
  };
}

export function useTypingComparisonView(
  wanted: string,
  inputRef: RefObject<HTMLDivElement>
) {
  const comparison = useTypingComparison(wanted);

  useEffect(() => {
    if (!inputRef || !inputRef.current) return;
    inputRef.current.tabIndex = 0;

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isKeyAllowed(e.key)) return;
      // Prevent scrolling when pressing space
      if (e.key === " ") e.preventDefault();

      const ts = e.timeStamp;
      switch (e.key) {
        case "Backspace":
          // CTRL is for Windows OS
          if (e.altKey || e.ctrlKey) {
            comparison.deleteWord(ts);
          } else {
            comparison.deleteChar(ts);
          }
          break;
        default:
          if (e.key === " ") {
            comparison.space(ts);
          } else {
            comparison.char(e.key, ts);
          }
          break;
      }
    };

    const el = inputRef.current;
    el.addEventListener("keydown", onKeyDown);
    return () => {
      console.log("remove listener");
      el.removeEventListener("keydown", onKeyDown);
    };
  }, [inputRef, comparison]);

  function handleReset() {
    comparison.reset();
    inputRef.current?.focus();
  }

  return {
    ...comparison,
    reset: handleReset
  };
}
