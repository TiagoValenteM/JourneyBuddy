import React, { createContext, useState } from "react";

type ErrorContextType = {
  modalErrorVisible: boolean;
  setModalErrorVisible: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage: string;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
};

export const ErrorContext = createContext<ErrorContextType>({
  modalErrorVisible: false,
  setModalErrorVisible: () => {},
  errorMessage: "",
  setErrorMessage: () => {},
});

type ErrorContextProviderProps = {
  children: React.ReactNode;
};

export const ErrorContextProvider: React.FC<ErrorContextProviderProps> = ({
  children,
}) => {
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <ErrorContext.Provider
      value={{
        modalErrorVisible,
        setModalErrorVisible,
        errorMessage,
        setErrorMessage,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};
