import ExtraSpace from "./ExtraSpace";
import { TypingTest } from "./TypingTest";
import "./styles.css";

export default function App() {
  return (
    <div className="sans-serif pa2">
      <h1>Typing Test</h1>
      <TypingTest />
      <ExtraSpace />
    </div>
  );
}
