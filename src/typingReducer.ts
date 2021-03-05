import _ from "lodash";

type CharAction = { ts: number } & (
  | { type: "ADD_CHAR"; char: string }
  | { type: "ADD_SPACE" }
  | { type: "DELETE_CHAR" }
  | { type: "DELETE_WORD" }
);

export type Action = CharAction | { type: "RESET" };

export type State = {
  history: Action[];
  //
  typedWords: string[];
  activeWord: string;
  wantedWords: string[];
  //
  wantedWordI: number;
  wantedCharI: number;
};

export const initialState = {
  history: [],
  //
  typedWords: [],
  activeWord: "",
  wantedWords: [],
  //
  wantedWordI: 0,
  wantedCharI: 0
};

export function typingReducer($: State = initialState, action: Action) {
  const wantedWord = $.wantedWords[$.wantedWordI];
  const lastTypedWord = $.typedWords[$.typedWords.length - 1];
  const addHistory = () => [...$.history, action];

  switch (action.type) {
    case "ADD_CHAR": {
      const char = action.char;
      return {
        ...$,
        history: addHistory(),
        activeWord: $.activeWord + char,
        // While not on last wanted char, keep updating wanted char
        // Otherwise, don't move on to next word or anything
        // TODO: consider having a clamp elswewhere so wantedCharI can be out of bounds
        wantedCharI:
          $.wantedCharI < wantedWord.length ? $.wantedCharI + 1 : $.wantedCharI
      };
    }
    case "ADD_SPACE": {
      // If pressing space while at the beginning of a word, then likely it's a mistake
      const notDoubleSpace = $.activeWord !== "";
      // While not one last word
      const whileWordIsInBounds = $.wantedWordI < $.wantedWords.length - 1;
      if (whileWordIsInBounds && notDoubleSpace) {
        return {
          ...$,
          history: addHistory(),
          typedWords: [...$.typedWords, $.activeWord],
          activeWord: "",
          wantedCharI: 0,
          wantedWordI: $.wantedWordI + 1
        };
      } else {
        return $;
      }
    }
    case "DELETE_CHAR": {
      if ($.activeWord.length > wantedWord.length) {
        return {
          ...$,
          history: addHistory(),
          activeWord: $.activeWord.slice(0, -1)
        };
      } else {
        const deletingSpace = $.activeWord.length === 0 && $.wantedWordI > 0;
        if (deletingSpace) {
          const wantedWordI = $.wantedWordI - 1;
          return {
            ...$,
            history: addHistory(),
            typedWords: $.typedWords.slice(0, -1),
            activeWord: lastTypedWord, // Set old typed word to active word
            wantedWordI,
            wantedCharI: lastTypedWord.length
          };
        } else {
          return {
            ...$,
            history: addHistory(),
            activeWord: $.activeWord.slice(0, -1),
            wantedCharI: Math.max(0, $.wantedCharI - 1)
          };
        }
      }
    }
    case "DELETE_WORD": {
      // Beginning of word
      if ($.wantedCharI === 0) {
        // Delete space and word
        if (lastTypedWord) {
          return {
            ...$,
            history: addHistory(),
            activeWord: "",
            typedWords: $.typedWords.slice(0, -1), // Remove last word
            wantedWordI: Math.max(0, $.wantedWordI - 1),
            wantedCharI: 0
          };
        } else {
          return $;
        }
      } else {
        return {
          ...$,
          history: addHistory(),
          activeWord: "",
          wantedCharI: 0
        };
      }
    }
    case "RESET": {
      return {
        ...initialState,
        wantedWords: $.wantedWords
      };
    }
    default: {
      throw new Error("Unsupported action");
    }
  }
}

export function atHistoryIndex(
  initialState: State,
  history: Action[],
  index: number
) {
  if (index === 0 || history.length === 0) return initialState;
  const clampedI = _.clamp(index, 0, history.length - 1);
  let state = initialState;
  for (let i = 0; i <= clampedI; i++) {
    state = typingReducer(state, history[i]);
  }

  return state;

  // return history.reduce(
  //   (state, action, i) =>
  //     i <= clampedI ? typingReducer(state, action) : state,
  //   initialState
  // );
}

export function typed($: State) {
  return [...$.typedWords, $.activeWord].join(" ");
}

export function toType($: State) {
  return $.wantedWords.slice($.wantedWordI).join(" ").slice($.wantedCharI);
}
