import { useContext } from "react";
import { ErrorContext } from "../context/errorHandlerContext";

export const useError = () => {
  const {
    modalErrorVisible,
    setModalErrorVisible,
    errorMessage,
    setErrorMessage,
  } = useContext(ErrorContext);

  const showError = (message?: string) => {
    setErrorMessage(
      message || "We're sorry, but something went wrong. Please try again."
    );
    setModalErrorVisible(true);
  };

  const hideError = () => {
    setModalErrorVisible(false);
    setErrorMessage("");
  };

  return {
    modalErrorVisible,
    errorMessage,
    showError,
    hideError,
  };
};
