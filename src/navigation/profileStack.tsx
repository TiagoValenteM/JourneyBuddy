import React from "react";
import Feather from "react-native-vector-icons/Feather";
import { Text } from "react-native";
import ProfileScreen from "../screens/Profile";
import EditProfileScreen from "../screens/EditProfile";
import FollowersScreen from "../screens/Followers";
import FollowingScreen from "../screens/Following";
import { createStackNavigator } from "@react-navigation/stack";
import GuideInDetailScreen from "../screens/GuideInDetail";
import { Guide } from "../models/guides";

const Stack = createStackNavigator();

interface ProfileStackProps {
  route: any;
}

function ProfileStack({ route }: ProfileStackProps) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [guides, setGuides] = React.useState<Guide[]>([]);
  const [selectedGuide, setSelectedGuide] = React.useState<Guide | null>(null);
  const currentUser = route.params?.userParam?.currentUser;

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile Page"
        options={() => ({
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
            refreshing={refreshing}
            setRefreshing={setRefreshing}
            guides={guides}
            setGuides={setGuides}
            setSelectedGuide={setSelectedGuide}
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
      <Stack.Screen
        name={"Guide In Detail"}
        options={{
          headerTitle: "Guide",
        }}
      >
        {(props) => (
          <GuideInDetailScreen {...props} selectedGuide={selectedGuide} />
        )}
      </Stack.Screen>
      <Stack.Screen name={"Followers"} component={FollowersScreen} />
      <Stack.Screen name={"Following"} component={FollowingScreen} />
    </Stack.Navigator>
  );
}

export default ProfileStack;
