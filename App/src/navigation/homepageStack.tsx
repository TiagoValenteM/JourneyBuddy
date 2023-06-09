import { createStackNavigator } from "@react-navigation/stack";
import Homepage from "../screens/Homepage";
import React from "react";
import ProfileScreen from "../screens/Profile";
import { useCurrentUser } from "../context/currentUserContext";
import FullScreenMap from "../screens/FullScreenMap";
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
        component={Homepage}
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
          <ProfileScreen
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
          <FullScreenMap {...props} guidePlaces={pressedGuide?.places} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default HomepageStack;
