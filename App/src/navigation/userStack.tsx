import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NewGuideStack from "./NewGuideStack";
import ProfileStack from "./profileStack";
import { getUserData } from "../database/userRepository/userRepository";
import { useAuthenticatedUser } from "../context/authenticatedUserContext";
import HomepageStack from "./homepageStack";
import { StatusBar } from "react-native";
import { useLoading } from "../hooks/useLoading";
import SearchStack from "./searchStack";
import { Home, PlusCircle, Search, User } from "react-native-feather";
import { auth } from "../config/firebase";
import Colors from "../../styles/colorScheme";

const Tab = createBottomTabNavigator();

export default function UserStack() {
  const { setAuthenticatedUser } = useAuthenticatedUser();
  const { startLoading, stopLoading } = useLoading();

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        startLoading();
        if (auth?.currentUser?.uid) {
          const user = await getUserData(auth?.currentUser?.uid);
          setAuthenticatedUser(user);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUser().then(stopLoading);
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Tab.Navigator
        initialRouteName={"HomepageStack"}
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.white,
            borderTopWidth: 0,
          },
          tabBarIcon: ({ color, size }) => {
            switch (route.name) {
              case "ProfileStack":
                return <User width={size} height={size} color={color} />;
              case "SearchStack":
                return <Search width={size} height={size} color={color} />;
              case "HomepageStack":
                return <Home width={size} height={size} color={color} />;
              case "GuidesStack":
                return <PlusCircle width={size} height={size} color={color} />;
              default:
                return null;
            }
          },
        })}
      >
        <Tab.Screen name="HomepageStack" component={HomepageStack} />
        <Tab.Screen name="SearchStack" component={SearchStack} />
        <Tab.Screen name="GuidesStack" component={NewGuideStack} />
        <Tab.Screen name="ProfileStack" component={ProfileStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
