/// <reference types="nativewind/types" />
import "./src/config/firebase";
import RootNavigation from "./src/navigation";
import { PressedGuideProvider } from "./src/context/pressedGuideContext";
import { AuthenticatedUserProvider } from "./src/context/authenticatedUserContext";
import { CurrentUserProvider } from "./src/context/currentUserContext";

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <CurrentUserProvider>
        <PressedGuideProvider>
          <RootNavigation />
        </PressedGuideProvider>
      </CurrentUserProvider>
    </AuthenticatedUserProvider>
  );
}
