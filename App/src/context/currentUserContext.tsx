import React, { createContext, useState, useContext, ReactNode } from "react";
import UserProfile from "../models/userProfiles";

interface CurrentUserContextProps {
  currentUser: UserProfile | undefined;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile | undefined>>;
  pressedUser: UserProfile | undefined;
  setPressedUser: React.Dispatch<React.SetStateAction<UserProfile | undefined>>;
}

const currentUserContext = createContext<CurrentUserContextProps>({
  currentUser: undefined,
  setCurrentUser: () => {},
  pressedUser: undefined,
  setPressedUser: () => {},
});

interface CurrentUserProviderProps {
  children: ReactNode;
}

export function CurrentUserProvider({ children }: CurrentUserProviderProps) {
  const [currentUser, setCurrentUser] = useState<UserProfile | undefined>(
    undefined
  );
  const [pressedUser, setPressedUser] = useState<UserProfile | undefined>(
    undefined
  );

  return (
    <currentUserContext.Provider
      value={{ currentUser, setCurrentUser, pressedUser, setPressedUser }}
    >
      {children}
    </currentUserContext.Provider>
  );
}

export function useCurrentUser() {
  const { currentUser, setCurrentUser, pressedUser, setPressedUser } =
    useContext(currentUserContext);

  return { currentUser, setCurrentUser, pressedUser, setPressedUser };
}
