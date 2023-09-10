import { createStackNavigator } from "@react-navigation/stack";
import HomepageView from "../screens/homepageStack/Homepage";
import React from "react";
import ProfileView from "../screens/common/Profile";
import { useCurrentUser } from "../context/currentUserContext";
import OverviewMapView from "../screens/common/OverviewMap";
import OverviewGuideView from "../screens/common/OverviewGuide";
import FollowingTabs from "./FollowingTabs";

const Stack = createStackNavigator();

function HomepageStack() {
  const { currentUser } = useCurrentUser();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Homepage"
        component={HomepageView}
        options={{
          headerTitle: "Homepage",
        }}
      />
      <Stack.Screen
        name="ProfileHomepage"
        options={{
          headerTitle: currentUser?.username,
          headerBackTitle: "Back",
        }}
      >
        {(props) => <ProfileView {...props} isAuthUser={false} />}
      </Stack.Screen>
      <Stack.Screen
        name={"MapOverview"}
        options={() => ({
          headerShown: false,
        })}
        component={OverviewMapView}
      />
      <Stack.Screen
        name={"GuideInDetail"}
        options={{
          headerTitle: "Guide",
        }}
        component={OverviewGuideView}
      />
      <Stack.Screen
        name={"FollowInteraction"}
        component={FollowingTabs}
        options={{
          headerTitle: currentUser?.username,
          headerBackTitle: "Back",
          headerStyle: {
            shadowColor: "transparent",
            elevation: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default HomepageStack;
