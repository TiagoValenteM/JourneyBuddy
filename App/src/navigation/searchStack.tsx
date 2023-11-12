import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ProfileView from "../screens/common/Profile";
import { useCurrentUser } from "../context/currentUserContext";
import OverviewMapView from "../screens/common/OverviewMap";
import OverviewGuideView from "../screens/common/OverviewGuide";
import SearchView from "../screens/searchStack/Search";
import Colors from "../../styles/colorScheme";

const Stack = createStackNavigator();

function SearchStack() {
  return (
    <Stack.Navigator
      screenOptions={{ cardStyle: { backgroundColor: Colors.white } }}
    >
      <Stack.Screen
        name="Search"
        component={SearchView}
        options={{
          headerTitle: "Search",
        }}
      />
      <Stack.Screen
        name="Profile"
        options={() => ({
          headerShown: false,
        })}
        component={ProfileView}
      />
      <Stack.Screen
        name={"MapOverview"}
        options={() => ({
          headerShown: false,
        })}
        component={OverviewMapView}
      />
      <Stack.Screen
        name={"GuideOverview"}
        options={{
          headerTitle: "Guide",
        }}
        component={OverviewGuideView}
      />
    </Stack.Navigator>
  );
}

export default SearchStack;
