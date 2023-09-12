import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UploadGuideStack from "./uploadGuideStack";
import ProfileStack from "./profileStack";
import { getAuthUserProfile } from "../database/userRepository";
import { useAuthenticatedUser } from "../context/authenticatedUserContext";
import HomepageStack from "./homepageStack";
import { useCurrentUser } from "../context/currentUserContext";
import { StatusBar } from "react-native";
import { useLoading } from "../hooks/useLoading";
import SearchStack from "./searchStack";
import { useGuide } from "../context/GuideContext";
import { getGuidesUser } from "../services/ManageGuides";
import { Home, PlusSquare, Search, User } from "react-native-feather";

const Tab = createBottomTabNavigator();

export default function UserStack() {
  const { setAuthenticatedUser } = useAuthenticatedUser();
  const { setCurrentUser } = useCurrentUser();
  const { setGuides } = useGuide();
  const { startLoading, stopLoading } = useLoading();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading();

        const user = await getAuthUserProfile();
        setAuthenticatedUser(user);
        setCurrentUser(user);

        const authUserGuides = await getGuidesUser(user?.uid);
        setGuides(authUserGuides);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        stopLoading();
      }
    };

    fetchData();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            switch (route.name) {
              case "ProfileStack":
                return <User width={size} height={size} color={color} />;
              case "SearchStack":
                return <Search width={size} height={size} color={color} />;
              case "HomepageStack":
                return <Home width={size} height={size} color={color} />;
              case "GuidesStack":
                return <PlusSquare width={size} height={size} color={color} />;
              default:
                return null;
            }
          },
        })}
      >
        <Tab.Screen name="HomepageStack" component={HomepageStack} />
        <Tab.Screen name="SearchStack" component={SearchStack} />
        <Tab.Screen name="GuidesStack" component={UploadGuideStack} />
        <Tab.Screen name="ProfileStack" component={ProfileStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
