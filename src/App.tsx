import EnsureSpaceDoesnt from "./EnsureSpaceDoesnt";
import "./styles.css";
import { TypingTest } from "./TypingTest";

export default function App() {
  return (
    <div className="sans-serif pa2">
      <h1>Typing Test</h1>
      <TypingTest />
      <EnsureSpaceDoesnt />
    </div>
  );
}
