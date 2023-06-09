import React from "react";
import { useAuth } from "../hooks/useAuth";
import UserStack from "./userStack";
import AuthStack from "./authStack";

const RootNavigation = () => {
  const { user } = useAuth();
  return user ? <UserStack /> : <AuthStack />;
};

export default RootNavigation;
