import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import FollowingScreen from "../screens/Following";
import FollowersScreen from "../screens/Followers";

const Tab = createMaterialTopTabNavigator();

const FollowingTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 14,
          textTransform: "none",
          fontWeight: "600",
        },
        tabBarIndicatorStyle: {
          backgroundColor: "#007AFF",
        },
      }}
    >
      <Tab.Screen name="Followers" component={FollowersScreen} />
      <Tab.Screen name="Following" component={FollowingScreen} />
    </Tab.Navigator>
  );
};

export default FollowingTabs;
