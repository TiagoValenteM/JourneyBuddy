import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import WelcomeView from "../screens/authStack/Welcome";
import SignInView from "../screens/authStack/SignIn";
import SignOutScreen from "../screens/authStack/SignUp";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          cardStyle: {
            backgroundColor: "#0e1529",
          },
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeView} />
        <Stack.Screen name="Sign In" component={SignInView} />
        <Stack.Screen name="Sign Up" component={SignOutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
