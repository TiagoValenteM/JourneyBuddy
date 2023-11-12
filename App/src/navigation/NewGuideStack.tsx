import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Guide, Place } from "../models/guides";
import Colors from "../../styles/colorScheme";
import NewGuideView from "../screens/NewGuideStack/NewGuide";
import { useAuthenticatedUser } from "../context/authenticatedUserContext";
import PlacePickerMap from "../screens/common/PlacePickerMap";

const Stack = createStackNavigator();

interface AddGuideStackProps {
  navigation: any;
}

function NewGuideStack({ navigation }: AddGuideStackProps) {
  const { authenticatedUser } = useAuthenticatedUser();
  const [guide, setGuide] = React.useState<Guide>(new Guide(authenticatedUser));
  const [places, setPlaces] = React.useState<Place[]>([]);

  return (
    <Stack.Navigator
      screenOptions={{ cardStyle: { backgroundColor: Colors.white } }}
    >
      <Stack.Screen
        name="NewGuide"
        options={{
          headerShown: false,
        }}
      >
        {(props) => (
          <NewGuideView
            {...props}
            navigation={navigation}
            guide={guide}
            setGuide={setGuide}
            places={places}
            setPlaces={setPlaces}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name={"NewPlace"}
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      >
        {(props) => (
          <PlacePickerMap
            {...props}
            navigation={navigation}
            setPlaces={setPlaces}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default NewGuideStack;
