import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Home";
import { createStackNavigator } from "@react-navigation/stack";

import Feather from "react-native-vector-icons/Feather";
import SearchScreen from "../screens/Search";
import AddGuideScreen from "../screens/AddGuide";
import ProfileScreen from "../screens/Profile";
import { Text } from "react-native";
import { getCurrentUserProfile } from "../database/userRepository";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ProfileStack() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<
    UserProfile | undefined
  >();

  React.useEffect(() => {
    getCurrentUserProfile().then((user) => setCurrentUser(user));
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile Page"
        options={({ navigation }) => ({
          headerRight: (props) => (
            <Feather
              name={"menu"}
              onPress={() => setModalVisible(true)}
              size={25}
            />
          ),
          headerTitle: "",
          headerLeft: () => (
            <Text style={{ fontSize: 20 }}>
              {currentUser?.username || currentUser?.email}
            </Text>
          ),
          headerLeftContainerStyle: {
            paddingLeft: 20,
          },
          headerRightContainerStyle: {
            paddingRight: 20,
          },
        })}
      >
        {(props) => (
          <ProfileScreen
            {...props}
            screenProps={{ modalVisible, setModalVisible }}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function UserStack() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Profile") {
              iconName = "user";
            } else if (route.name === "Search") {
              iconName = "search";
            } else if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "New Guide") {
              iconName = "plus-square";
            }

            return <Feather name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="New Guide" component={AddGuideScreen} />
        <Tab.Screen name="Profile" component={ProfileStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
