import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Home";

import Feather from "react-native-vector-icons/Feather";
import SearchScreen from "../screens/Search";
import AddGuideStack from "./addGuideStack";
import ProfileStack from "./profileStack";
import { getAuthUserProfile } from "../database/userRepository";
import LoadingIndicator from "../components/indicators/LoadingIndicator";
import { useAuthenticatedUser } from "../context/authenticatedUserContext";
import HomepageStack from "./homepageStack";

const Tab = createBottomTabNavigator();

export default function UserStack() {
  const { setAuthenticatedUser, authenticatedUser } = useAuthenticatedUser();
  const [currentUser, setCurrentUser] = React.useState<UserProfile | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = React.useState(true); // Track loading state

  React.useEffect(() => {
    getAuthUserProfile()
      .then((user) => {
        setCurrentUser(user);
        setAuthenticatedUser(user);
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <LoadingIndicator />;
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
              case "Guides":
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
        <Tab.Screen name="Home" component={HomepageStack} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen
          name="Guides"
          component={AddGuideStack}
          initialParams={{ userParam: { authenticatedUser } }} // Update the initialParams structure
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          initialParams={{
            userParam: { authenticatedUser, currentUser },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
