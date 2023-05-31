/// <reference types="nativewind/types" />
import "./src/config/firebase";
import RootNavigation from "./src/navigation";
import { PressedGuideProvider } from "./src/context/pressedGuideContext";

export default function App() {
  return (
    <PressedGuideProvider>
      <RootNavigation />
    </PressedGuideProvider>
  );
}
