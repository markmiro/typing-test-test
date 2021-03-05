import { RefObject, useEffect, useRef } from "react";

export function Caret({
  caretTargetRef
}: {
  caretTargetRef: RefObject<HTMLSpanElement>;
}) {
  const caretRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!caretRef.current) return;
    caretRef.current.style.opacity = caretTargetRef.current ? "1" : "0";
    caretRef.current.style.top = caretTargetRef.current?.offsetTop + "px";
    caretRef.current.style.left =
      (caretTargetRef.current?.offsetLeft || 0) +
      (caretTargetRef.current?.offsetWidth || 0) +
      "px";
    const $caret = caretRef.current;
    const id = setTimeout(() => $caret?.classList.add("tt-blink"), 700);
    return () => {
      $caret?.classList.remove("tt-blink");
      clearTimeout(id);
    };
  });

  return (
    <div
      ref={caretRef}
      className="tt-blink-none"
      style={{
        position: "absolute",
        borderRight: "0.1em solid black",
        height: "1em",
        transitionProperty: "left, top, opacity",
        transitionDuration: "80ms",
        transitionTimingFunction: "ease-out"
      }}
    />
  );
}
