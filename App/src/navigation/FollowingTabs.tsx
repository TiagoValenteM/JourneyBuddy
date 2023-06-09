import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import FollowingView from "../screens/common/Following";
import FollowersView from "../screens/common/Followers";

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
      <Tab.Screen name="Followers" component={FollowersView} />
      <Tab.Screen name="Following" component={FollowingView} />
    </Tab.Navigator>
  );
};

export default FollowingTabs;
