import React from "react";
import { Modal, Text, View, Pressable, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Home";
import SettingsScreen from "../screens/Settings";
import { createStackNavigator } from "@react-navigation/stack";

import Feather from "react-native-vector-icons/Feather";
import SearchScreen from "../screens/Search";
import AddGuideScreen from "../screens/AddGuide";
import ProfileScreen from "../screens/Profile";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function UserStack() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Profile") {
              iconName = "user";
            } else if (route.name === "Search") {
              iconName = "search";
            } else if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "New Guide") {
              iconName = "plus-square";
            }

            return <Feather name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="New Guide" component={AddGuideScreen} />
        <Tab.Screen name="Profile" component={ProfileStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
