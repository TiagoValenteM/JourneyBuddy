/// <reference types="nativewind/types" />
import "./src/config/firebase";
import RootNavigation from "./src/navigation";
import { GuideProvider } from "./src/context/GuideContext";
import { AuthenticatedUserProvider } from "./src/context/authenticatedUserContext";
import { CurrentUserProvider } from "./src/context/currentUserContext";
import { ErrorContextProvider } from "./src/context/errorHandlerContext";
import ErrorIndicator from "./src/components/indicators/ErrorIndicator";
import LoadingIndicator from "./src/components/indicators/LoadingIndicator";
import { LoadingContextProvider } from "./src/context/loadingHandlerContext";

export default function App() {
  return (
    <ErrorContextProvider>
      <LoadingContextProvider>
        <AuthenticatedUserProvider>
          <CurrentUserProvider>
            <GuideProvider>
              <RootNavigation />
              <LoadingIndicator />
              <ErrorIndicator />
            </GuideProvider>
          </CurrentUserProvider>
        </AuthenticatedUserProvider>
      </LoadingContextProvider>
    </ErrorContextProvider>
  );
}
