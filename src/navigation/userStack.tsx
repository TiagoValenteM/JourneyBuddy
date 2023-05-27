import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Home";
import { createStackNavigator } from "@react-navigation/stack";

import Feather from "react-native-vector-icons/Feather";
import SearchScreen from "../screens/Search";
import AddGuideScreen from "../screens/AddGuide";
import ProfileScreen from "../screens/Profile";
import { ActivityIndicator, Text, View } from "react-native";
import { getCurrentUserProfile } from "../database/userRepository";
import EditProfileScreen from "../screens/EditProfile";
import FollowingScreen from "../screens/Following";
import FollowersScreen from "../screens/Followers";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ProfileStack({ route }: { route: any }) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const currentUser = route.params?.userParam?.currentUser;

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
            <Text style={{ fontSize: 20, fontWeight: "600" }}>
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
            currentUser={currentUser}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name={"Edit Profile"}
        options={{
          gestureEnabled: false,
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
                extrapolate: "clamp",
              }),
              transform: [
                {
                  translateY: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1000, 0],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          }),
          transitionSpec: {
            open: {
              animation: "timing",
              config: {
                duration: 300, // Adjust the duration as desired
              },
            },
            close: {
              animation: "timing",
              config: {
                duration: 300, // Adjust the duration as desired
              },
            },
          },
        }}
      >
        {(props) => <EditProfileScreen {...props} currentUser={currentUser} />}
      </Stack.Screen>
      <Stack.Screen name={"Followers"} component={FollowersScreen} />
      <Stack.Screen name={"Following"} component={FollowingScreen} />
    </Stack.Navigator>
  );
}

function AddGuideStack({ route }: { route: any }) {
  const currentUser = route.params?.userParam?.currentUser;
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Add Guide Page"
        options={{
          headerTitle: "New Guide",
        }}
      >
        {(props) => <AddGuideScreen {...props} currentUser={currentUser} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function UserStack() {
  const [currentUser, setCurrentUser] = React.useState<
    UserProfile | undefined
  >();
  const [isLoading, setIsLoading] = React.useState(true); // Track loading state

  React.useEffect(() => {
    getCurrentUserProfile()
      .then((user) => setCurrentUser(user))
      .finally(() => setIsLoading(false)); // Update loading state when finished
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarShowLabel: false,
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;

            switch (route.name) {
              case "Profile":
                iconName = "user";
                break;
              case "Search":
                iconName = "search";
                break;
              case "Home":
                iconName = "home";
                break;
              case "New Guide":
                iconName = "plus-square";
                break;
              default:
                iconName = ""; // Default icon, nothing to show
                break;
            }
            return <Feather name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen
          name="New Guide"
          component={AddGuideStack}
          initialParams={{ userParam: { currentUser } }} // Update the initialParams structure
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          initialParams={{ userParam: { currentUser } }} // Update the initialParams structure
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
