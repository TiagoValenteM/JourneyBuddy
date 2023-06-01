import React, { createContext, useState, useContext, ReactNode } from "react";

interface CurrentUserContextProps {
  currentUser: UserProfile | undefined;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | undefined>>;
}

const currentUserContext = createContext<CurrentUserContextProps>({
  currentUser: undefined,
  setCurrentUser: () => {},
});

interface CurrentUserProviderProps {
  children: ReactNode;
}

export function CurrentUserProvider({ children }: CurrentUserProviderProps) {
  const [currentUser, setCurrentUser] = useState<UserProfile | undefined>(
    undefined
  );

  return (
    <currentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </currentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const { currentUser, setCurrentUser } = useContext(currentUserContext);

  return { currentUser, setCurrentUser };
}
