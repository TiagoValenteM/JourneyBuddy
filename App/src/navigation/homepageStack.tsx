import { createStackNavigator } from "@react-navigation/stack";
import HomepageView from "../screens/homepageStack/Homepage";
import React from "react";
import ProfileView from "../screens/common/Profile";
import { useCurrentUser } from "../context/currentUserContext";
import OverviewMapView from "../screens/common/OverviewMap";
import OverviewGuideView from "../screens/common/OverviewGuide";
import Colors from "../../styles/colorScheme";

const Stack = createStackNavigator();

function HomepageStack() {
  return (
    <Stack.Navigator
      screenOptions={{ cardStyle: { backgroundColor: Colors.white } }}
    >
      <Stack.Screen
        name="Homepage"
        component={HomepageView}
        options={{
          headerTitle: "Homepage",
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
        name={"OverviewGuide"}
        options={{
          headerShown: false,
        }}
        component={OverviewGuideView}
      />
    </Stack.Navigator>
  );
}

export default HomepageStack;
