import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feather from "react-native-vector-icons/Feather";
import SearchView from "../screens/searchStack/Search";
import AddGuideStack from "./addGuideStack";
import ProfileStack from "./profileStack";
import { getAuthUserProfile } from "../database/userRepository";
import LoadingIndicator from "../components/indicators/LoadingIndicator";
import { useAuthenticatedUser } from "../context/authenticatedUserContext";
import HomepageStack from "./homepageStack";
import { useCurrentUser } from "../context/currentUserContext";

const Tab = createBottomTabNavigator();

export default function UserStack() {
  const { setAuthenticatedUser, authenticatedUser } = useAuthenticatedUser();
  const { setCurrentUser } = useCurrentUser();
  const [isLoading, setIsLoading] = React.useState(true); // Track loading state

  React.useEffect(() => {
    getAuthUserProfile()
      .then((user) => {
        setAuthenticatedUser(user);
        setCurrentUser(user);
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
              case "ProfileStack":
                iconName = "user";
                break;
              case "SearchStack":
                iconName = "search";
                break;
              case "HomepageStack":
                iconName = "home";
                break;
              case "GuidesStack":
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
        <Tab.Screen name="HomepageStack" component={HomepageStack} />
        <Tab.Screen name="SearchStack" component={SearchView} />
        <Tab.Screen name="GuidesStack" component={AddGuideStack} />
        <Tab.Screen name="ProfileStack" component={ProfileStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
