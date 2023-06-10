import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import SignInView from "../screens/authStack/SignIn";
import { StatusBar } from "react-native";
import SignUpView from "../screens/authStack/SignUp";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="SignIn"
          component={SignInView}
          options={{
            gestureEnabled: false,
            presentation: "transparentModal",
            animationTypeForReplace: "push",
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpView}
          options={{
            gestureEnabled: false,
            presentation: "transparentModal",
            animationTypeForReplace: "push",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
