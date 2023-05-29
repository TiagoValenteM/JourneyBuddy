import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Home";
import { createStackNavigator } from "@react-navigation/stack";

import Feather from "react-native-vector-icons/Feather";
import SearchScreen from "../screens/Search";
import { ActivityIndicator, Text, View } from "react-native";
import { getCurrentUserProfile } from "../database/userRepository";
import AddGuideStack from "./addGuideStack";
import ProfileStack from "./profileStack";

const Tab = createBottomTabNavigator();

export default function UserStack() {
  const [currentUser, setCurrentUser] = React.useState<
    UserProfile | undefined
  >();
  const [isLoading, setIsLoading] = React.useState(true); // Track loading state

  React.useEffect(() => {
    getCurrentUserProfile()
      .then((user) => setCurrentUser(user))
      .finally(() => setIsLoading(false)); // Update loading state when finished
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;

            switch (route.name) {
              case "Profile":
                iconName = "user";
                break;
              case "Search":
                iconName = "search";
                break;
              case "Home":
                iconName = "home";
                break;
              case "New Guide":
                iconName = "plus-square";
                break;
              default:
                iconName = ""; // Default icon, nothing to show
                break;
            }
            return <Feather name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen
          name="New Guide"
          component={AddGuideStack}
          initialParams={{ userParam: { currentUser } }} // Update the initialParams structure
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          initialParams={{ userParam: { currentUser } }} // Update the initialParams structure
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
