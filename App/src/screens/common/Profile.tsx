import React, { useEffect } from "react";
import {
  RefreshControl,
  ScrollView,
  View,
  Text,
  Pressable,
  SafeAreaView,
} from "react-native";
import ProfileModal from "../../components/modals/ProfileModal";
import { getGuidesUser } from "../../services/ManageGuides";
import GridImage from "../../components/grids/GridImage";
import { useAuthenticatedUser } from "../../context/authenticatedUserContext";
import { useError } from "../../hooks/useError";
import Colors from "../../../styles/colorScheme";
import { RouteProp } from "@react-navigation/native";
import UserProfile from "../../models/userProfiles";
import FollowersBottomsheet from "../../components/bottomsheets/followersBottomsheet";
import ProfileIdentifier from "../../components/identifiers/ProfileIdentifier";
import { Guide } from "../../models/guides";
import { PlusCircle } from "react-native-feather";
import Header from "../../components/headers/Header";
import {
  follow,
  unfollow,
} from "../../database/userRepository/follow/followRepository";

interface ProfileScreenProps {
  navigation: any;
  route: RouteProp<UserProfile | any>;
}

function ProfileView({ navigation, route }: ProfileScreenProps) {
  const user: UserProfile = route?.params?.user;
  const [modalVisible, setModalVisible] = React.useState(false);
  const [userGuides, setUserGuides] = React.useState<Guide[]>([]);
  const [followBtmSheetVisible, setFollowBtmSheetVisible] =
    React.useState(false);
  const [isFollowers, setIsFollowers] = React.useState(false);
  const [dataIDs, setDataIDs] = React.useState<string[]>([]);
  const { authenticatedUser, setAuthenticatedUser } = useAuthenticatedUser();
  const [refreshing, setRefreshing] = React.useState(false);
  const { showError } = useError();

  const onRefresh = () => {
    setRefreshing(true);
    setModalVisible(false);
    getGuidesUser(user?.uid)
      .then((fetchedGuides) => {
        setUserGuides(fetchedGuides);
        setRefreshing(false);
      })
      .catch((err) => {
        showError("Failed to load guides. Please try again later.");
        console.log("Error fetching user guides:", err);
      });
  };

  useEffect(() => {
    getGuidesUser(user?.uid)
      .then((fetchedGuides) => {
        setUserGuides(fetchedGuides);
      })
      .catch((err) => {
        showError("Failed to load guides. Please try again later.");
        console.log("Error fetching user guides:", err);
      });
  }, [user]);

  const handleFollow = async () => {
    if (authenticatedUser) {
      follow(
        authenticatedUser,
        user.uid,
        setAuthenticatedUser,
        showError
      ).catch((error) => {
        console.error("Error handling follow:", error);
      });
    }
  };

  const handleUnfollow = async () => {
    if (authenticatedUser) {
      unfollow(
        authenticatedUser,
        user.uid,
        setAuthenticatedUser,
        showError
      ).catch((error) => {
        console.error("Error handling follow:", error);
      });
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          setModalVisible={setModalVisible}
          title={user?.username}
          options={true}
          backButton={false}
        />
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 15 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <ProfileIdentifier
            user={user}
            setFollowBtmSheetVisible={setFollowBtmSheetVisible}
            setDataIDs={setDataIDs}
            setIsFollowers={setIsFollowers}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: 10,
              paddingHorizontal: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  color: Colors.black,
                }}
              >
                Guides
              </Text>
              {user.uid === authenticatedUser?.uid ? (
                <Pressable>
                  <PlusCircle
                    width={28}
                    height={28}
                    color={Colors.blue}
                    style={{ marginLeft: 10 }}
                  />
                </Pressable>
              ) : null}
            </View>

            {user?.uid === authenticatedUser?.uid ? (
              <Pressable
                style={{
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  justifyContent: "center",
                  backgroundColor: Colors.lightGray,
                  alignItems: "center",
                }}
                onPress={() => {
                  navigation.navigate("Edit Profile");
                }}
              >
                <Text
                  style={{
                    color: Colors.darkGray,
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  Edit Profile
                </Text>
              </Pressable>
            ) : Array.isArray(authenticatedUser?.following) &&
              authenticatedUser?.following?.includes(user!!.uid) ? (
              <Pressable
                style={{
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  justifyContent: "center",
                  backgroundColor: Colors.lightGray,
                  alignItems: "center",
                }}
                onPress={handleUnfollow}
              >
                <Text
                  style={{
                    color: Colors.darkGray,
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  Unfollow
                </Text>
              </Pressable>
            ) : (
              <Pressable
                style={{
                  borderRadius: 10,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  justifyContent: "center",
                  backgroundColor: Colors.lightGray,
                  alignItems: "center",
                }}
                onPress={handleFollow}
              >
                <Text
                  style={{
                    color: Colors.darkGray,
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  Follow
                </Text>
              </Pressable>
            )}
          </View>

          {userGuides?.length > 0 ? (
            <GridImage
              guides={userGuides}
              navigation={navigation}
              authUser={authenticatedUser!}
            />
          ) : (
            <View
              style={{
                backgroundColor: Colors.lightGray,
                borderRadius: 10,
                padding: 15,
                marginVertical: 10,
              }}
            >
              <Text
                style={{ fontSize: 15, fontWeight: "bold", color: Colors.gray }}
              >
                No guides found.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      {modalVisible && (
        <ProfileModal
          setModalVisible={setModalVisible}
          navigation={navigation}
        />
      )}
      {followBtmSheetVisible && (
        <FollowersBottomsheet
          setFollowBtmSheetVisible={setFollowBtmSheetVisible}
          navigation={navigation}
          followBtmSheetVisible={followBtmSheetVisible}
          isFollowers={isFollowers}
          dataIDs={dataIDs}
        />
      )}
    </>
  );
}

export default ProfileView;
