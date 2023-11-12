import { Pressable, Text, TouchableWithoutFeedback, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Colors from "../../../styles/colorScheme";
import UserIdentifier from "../identifiers/UserIdentifier";
import UserProfile from "../../models/userProfiles";
import { getUserData } from "../../database/userRepository/userRepository";

interface FollowBottomSheetProps {
  dataIDs: string[];
  navigation: any;
  followBtmSheetVisible: boolean;
  setFollowBtmSheetVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isFollowers: boolean;
}

const FollowBottomSheet = ({
  dataIDs,
  navigation,
  followBtmSheetVisible,
  setFollowBtmSheetVisible,
  isFollowers,
}: FollowBottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["85%"];

  const createBottomSheetController = (
    setVisibility: React.Dispatch<React.SetStateAction<boolean>>,
    bottomSheetRef: any
  ) => {
    const showBottomSheet = () => {
      setVisibility(true);
      bottomSheetRef.current?.open();
    };

    const hideBottomSheet = () => {
      setVisibility(false);
      bottomSheetRef.current?.close();
    };

    return { showBottomSheet, hideBottomSheet };
  };

  const bottomSheetController = createBottomSheetController(
    setFollowBtmSheetVisible,
    bottomSheetRef
  );

  useEffect(() => {
    if (followBtmSheetVisible) {
      bottomSheetRef.current?.expand();
      fetchUsers();
    } else {
      bottomSheetController.hideBottomSheet();
    }
  }, [followBtmSheetVisible]);

  const [users, setUsers] = useState<UserProfile[]>([]);

  const fetchUsers = async () => {
    if (dataIDs) {
      const fetchedUsers: UserProfile[] = (await Promise.all(
        dataIDs.map((userID) => getUserData(userID))
      )) as UserProfile[];
      setUsers(fetchedUsers);
    }
  };

  useEffect(() => {
    if (users.length > 0) {
      users.forEach((user) => {
        getUserData(user.uid).then((user) => {
          user!.username = user!.username;
        });
      });
    }
  }, [users]);

  const handleBackdropPress = () => {
    bottomSheetController.hideBottomSheet();
  };

  return (
    <TouchableWithoutFeedback onPress={handleBackdropPress}>
      <View
        style={{
          flex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <BottomSheet
          style={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
          keyboardBehavior={"interactive"}
          snapPoints={snapPoints}
          ref={bottomSheetRef}
          enablePanDownToClose={true}
          onClose={bottomSheetController.hideBottomSheet}
          backgroundStyle={{
            borderRadius: 30,
            backgroundColor: Colors.white,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
          handleIndicatorStyle={{
            width: 50,
            height: 5,
            backgroundColor: "#dfe0e3",
            alignSelf: "center",
            marginVertical: 10,
            borderRadius: 20,
          }}
        >
          <BottomSheetScrollView>
            <View style={{ padding: 15, flex: 1 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 18,
                  color: Colors.black,
                  marginBottom: 20,
                }}
              >
                {isFollowers ? "Followers" : "Following"}
              </Text>
              {users.map((user) => (
                <Pressable
                  style={{
                    marginVertical: 10,
                  }}
                  key={user.uid}
                  onPress={() => {
                    bottomSheetController.hideBottomSheet();
                    navigation.navigate("Profile", {
                      user: user,
                    });
                  }}
                >
                  <UserIdentifier
                    username={user.username}
                    userID={user.uid}
                    navigation={navigation}
                    bottomSheetTrigger={bottomSheetController}
                  />
                </Pressable>
              ))}
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default FollowBottomSheet;
