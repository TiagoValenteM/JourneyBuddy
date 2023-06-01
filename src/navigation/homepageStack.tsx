import { createStackNavigator } from "@react-navigation/stack";
import Homepage from "../screens/Homepage";
import React from "react";
import ProfileScreen from "../screens/Profile";

const Stack = createStackNavigator();

function HomepageStack() {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Homepage"
        component={Homepage}
        options={{
          headerTitle: "Homepage",
        }}
      />
      <Stack.Screen name="ProfileHomepage">
        {(props) => (
          <ProfileScreen
            {...props}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            isAuthUser={false}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default HomepageStack;
