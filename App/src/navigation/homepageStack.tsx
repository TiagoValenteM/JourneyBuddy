import { createStackNavigator } from "@react-navigation/stack";
import HomepageView from "../screens/homepageStack/Homepage";
import React from "react";
import ProfileView from "../screens/common/Profile";
import { useCurrentUser } from "../context/currentUserContext";
import OverviewMapView from "../screens/common/OverviewMap";
import { usePressedGuide } from "../context/pressedGuideContext";

const Stack = createStackNavigator();

function HomepageStack() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const { currentUser } = useCurrentUser();
  const { pressedGuide } = usePressedGuide();

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
        {(props) => (
          <ProfileView
            {...props}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            isAuthUser={false}
          />
        )}
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
    </Stack.Navigator>
  );
}

export default HomepageStack;
