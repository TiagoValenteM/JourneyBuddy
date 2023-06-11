import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ProfileView from "../screens/common/Profile";
import { useCurrentUser } from "../context/currentUserContext";
import OverviewMapView from "../screens/common/OverviewMap";
import { useGuide } from "../context/GuideContext";
import OverviewGuideView from "../screens/common/OverviewGuide";
import FollowingTabs from "./FollowingTabs";
import SearchView from "../screens/searchStack/Search";

const Stack = createStackNavigator();

function SearchStack() {
  const { currentUser } = useCurrentUser();
  const { pressedGuide } = useGuide();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        component={SearchView}
        options={{
          headerTitle: "Search",
        }}
      />
      <Stack.Screen
        name="ProfileSearch"
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
      >
        {(props) => (
          <OverviewMapView {...props} guidePlaces={pressedGuide?.places} />
        )}
      </Stack.Screen>
      <Stack.Screen
        name={"GuideOverview"}
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

export default SearchStack;
