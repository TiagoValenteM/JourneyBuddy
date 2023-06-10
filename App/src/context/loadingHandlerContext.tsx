import React, { createContext, useState } from "react";

type LoadingContextType = {
  loadingVisible: boolean;
  setLoadingVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoadingContext = createContext<LoadingContextType>({
  loadingVisible: false,
  setLoadingVisible: () => {},
});

type LoadingContextProviderProps = {
  children: React.ReactNode;
};

export const LoadingContextProvider: React.FC<LoadingContextProviderProps> = ({
  children,
}) => {
  const [loadingVisible, setLoadingVisible] = useState(false);

  return (
    <LoadingContext.Provider
      value={{
        loadingVisible,
        setLoadingVisible,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
