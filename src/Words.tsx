import React, { FC, useRef } from "react";
import { Caret } from "./Caret";
import _ from "lodash";

const Word: FC = ({ children }) => <div className="ma1">{children}</div>;

export function Words({
  typedWords,
  activeWord,
  wantedWords,
  wantedWordI,
  wantedCharI
}: {
  typedWords: string[];
  activeWord: string;
  wantedWords: string[];
  wantedWordI: number;
  wantedCharI: number;
}) {
  const caretTargetRef = useRef<HTMLSpanElement>(null);

  const restOfWantedWords = wantedWords.slice(wantedWordI);
  const restOfWantedWord = (typedWord: string, i: number) => {
    return wantedWords[i].slice(typedWord.length);
  };
  const restOfActiveWord = () => {
    return _.head(restOfWantedWords)?.slice(wantedCharI);
  };

  return (
    <div
      // `relative` because caret is absolutely positioned
      className="tl flex flex-wrap relative"
      style={{ whiteSpace: "pre-wrap" }}
    >
      {typedWords.map((w, i) => (
        <Word key={w + i}>
          <span className="o-50">{w}</span>
          <span>{restOfWantedWord(w, i)}</span>
        </Word>
      ))}
      <Word>
        <span className="o-50" ref={caretTargetRef}>
          {activeWord}
        </span>
        <span>{restOfActiveWord()}</span>
      </Word>
      {_.tail(restOfWantedWords).map((w, i) => (
        <Word key={w + i}>{w}</Word>
      ))}
      <Caret caretTargetRef={caretTargetRef} />
    </div>
  );
}
