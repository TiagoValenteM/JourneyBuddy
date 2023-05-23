import React from "react";
import {Modal, Text, View, Pressable, Button} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Home";
import CallScreen from "../screens/Call";
import SettingsScreen from "../screens/Settings";

const Tab = createBottomTabNavigator();

export default function UserStack() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: { backgroundColor: "#0e1529" },
                }}
                sceneContainerStyle={{ backgroundColor: "#0e1529" }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarShowLabel: false,
                        tabBarIcon: ({ focused }) => (
                            <Button
                                color={focused ? "white" : "gray"}
                                title={"home"}/>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Call"
                    component={CallScreen}
                    options={{
                        tabBarShowLabel: false,
                        tabBarIcon: ({ focused }) => (
                            <Button
                                title="users"
                                color={focused ? "white" : "gray"}
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Settings"
                    component={SettingsScreen}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                        },
                    }}
                    options={{
                        tabBarShowLabel: false,
                        tabBarIcon: () => <SettingsScreen />,
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
