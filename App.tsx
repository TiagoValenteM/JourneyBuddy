/// <reference types="nativewind/types" />
import "./src/config/firebase";
import RootNavigation from "./src/navigation";
import { PressedGuideProvider } from "./src/context/pressedGuideContext";
import { AuthenticatedUserProvider } from "./src/context/authenticatedUserContext";
import { CurrentUserProvider } from "./src/context/currentUserContext";
import { ErrorContextProvider } from "./src/context/errorHandlerContext";
import ErrorIndicator from "./src/components/indicators/ErrorIndicator";

export default function App() {
  return (
    <ErrorContextProvider>
      <AuthenticatedUserProvider>
        <CurrentUserProvider>
          <PressedGuideProvider>
            <RootNavigation />
            <ErrorIndicator />
          </PressedGuideProvider>
        </CurrentUserProvider>
      </AuthenticatedUserProvider>
    </ErrorContextProvider>
  );
}
