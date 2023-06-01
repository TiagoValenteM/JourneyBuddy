import { createStackNavigator } from "@react-navigation/stack";
import Homepage from "../screens/Home";

const Stack = createStackNavigator();

interface HomepageStackProps {
  navigation: any;
}

function HomepageStack({ navigation }: HomepageStackProps) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Homepage"
        component={Homepage}
        options={{
          headerTitle: "Homepage",
        }}
      />
    </Stack.Navigator>
  );
}

export default HomepageStack;
