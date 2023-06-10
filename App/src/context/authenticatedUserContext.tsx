import React, { createContext, useState, useContext, ReactNode } from "react";
import UserProfile from "../models/userProfiles";

interface AuthContextProps {
  authenticatedUser: UserProfile | undefined;
  setAuthenticatedUser: React.Dispatch<
    React.SetStateAction<UserProfile | undefined>
  >;
}

const authenticatedUserContext = createContext<AuthContextProps>({
  authenticatedUser: undefined,
  setAuthenticatedUser: () => {},
});

interface AuthenticatedUserProviderProps {
  children: ReactNode;
}

export function AuthenticatedUserProvider({
  children,
}: AuthenticatedUserProviderProps) {
  const [authenticatedUser, setAuthenticatedUser] = useState<
    UserProfile | undefined
  >(undefined);

  return (
    <authenticatedUserContext.Provider
      value={{ authenticatedUser, setAuthenticatedUser }}
    >
      {children}
    </authenticatedUserContext.Provider>
  );
}

export function useAuthenticatedUser() {
  const { authenticatedUser, setAuthenticatedUser } = useContext(
    authenticatedUserContext
  );

  return { authenticatedUser, setAuthenticatedUser };
}
