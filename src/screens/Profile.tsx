import React from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import MenuModal from "../components/MenuModal";
import { auth } from "../config/firebase";
import { defaultProfilePicture } from "../services/ImageUpload";
import { getGuidesCurrentUser } from "../services/ManageGuides";
import { Guide } from "../models/guides";
import GridImage from "../components/GridImage";
interface ProfileScreenProps {
  navigation: any;
  screenProps: { modalVisible: boolean; setModalVisible: any };
  currentUser?: UserProfile;
  setRefreshing: any;
  refreshing: boolean;
  guides: Guide[];
  setGuides: any;
  setSelectedGuide: any;
}
function ProfileScreen({
  navigation,
  screenProps,
  currentUser,
  setRefreshing,
  refreshing,
  guides,
  setGuides,
  setSelectedGuide,
}: ProfileScreenProps) {
  const onRefresh = () => {
    setRefreshing(true);

    const fetchUserGuides = async () => {
      if (currentUser) {
        try {
          const fetchedGuides: Guide[] = await getGuidesCurrentUser(
            currentUser
          );
          setGuides(fetchedGuides);
        } catch (error) {
          console.log("Error fetching user guides:", error);
        }
      }
      setRefreshing(false); // Move this line inside the fetchUserGuides function
    };

    fetchUserGuides(); // Call the fetchUserGuides function
  };

  React.useEffect(() => {
    onRefresh(); // Call onRefresh directly to fetch user guides on initial load
  }, [currentUser]);

  return currentUser ? (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View
        style={{
          flex: 1,
          borderBottomWidth: 2,
          borderBottomColor: "#dfe0e3",
          paddingVertical: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            height: 180,
          }}
        >
          <Image
            source={{
              uri: currentUser?.profilePicturePath || defaultProfilePicture,
            }}
            style={{ height: 100, width: 100, borderRadius: 100 }}
          ></Image>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {guides?.length || "0"}
            </Text>
            <Text>Guides</Text>
          </View>
          <Pressable
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              navigation.navigate("Followers");
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {currentUser?.followers?.length || "0"}
            </Text>
            <Text>Followers</Text>
          </Pressable>
          <Pressable
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              navigation.navigate("Following");
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {currentUser?.following?.length || "0"}{" "}
            </Text>
            <Text>Following</Text>
          </Pressable>
        </View>
        <Text className={"font-semibold ml-5"}>
          {currentUser.fullName || currentUser.email}
        </Text>
        <View className={"flex flex-row justify-center items-center w-full"}>
          {currentUser.uid === auth.currentUser?.uid ? (
            <Pressable
              style={{
                backgroundColor: "#dfe0e3",
                width: "85%",
                borderRadius: 10,
                height: 28,
                justifyContent: "center",
              }}
              onPress={() => {
                navigation.navigate("Edit Profile");
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontWeight: "600",
                  fontSize: 14,
                }}
              >
                Edit Profile
              </Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                style={{
                  backgroundColor: "#dfe0e3",
                  width: "85%",
                  borderRadius: 10,
                  height: 28,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    textAlignVertical: "center",
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  Follow
                </Text>
              </Pressable>
              <Pressable
                style={{
                  backgroundColor: "#dfe0e3",
                  width: "85%",
                  borderRadius: 10,
                  height: 28,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    textAlignVertical: "center",
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  Unfollow
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      <View>
        <GridImage
          guides={guides}
          navigation={navigation}
          setSelectedGuide={setSelectedGuide}
        />
      </View>

      <MenuModal screenProps={screenProps} />
    </ScrollView>
  ) : (
    <View />
  );
}

export default ProfileScreen;
