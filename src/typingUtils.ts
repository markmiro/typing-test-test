export function isKeyAllowed(key: string) {
  // http://www.asciitable.com/ (valid keys between 32 and 126)
  const keyWithinRange =
    key.length === 1 && key.charCodeAt(0) >= 32 && key.charCodeAt(0) <= 126;
  const isBackspace = key === "Backspace";
  return isBackspace || keyWithinRange;
}
