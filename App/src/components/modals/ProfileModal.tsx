import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { getAuth, signOut } from "firebase/auth";
import Feather from "react-native-vector-icons/Feather";
import React, { useRef } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const auth = getAuth();

interface ProfileModalProps {
  navigation: any;
  setModalVisible: any;
}

const ProfileModal = ({ navigation, setModalVisible }: ProfileModalProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["30%", "50%"];

  const handleBackdropPress = () => {
    bottomSheetRef.current?.close();
    setModalVisible(false);
  };

  const handleSavedPress = () => {
    bottomSheetRef.current?.close();
    setModalVisible(false);
    navigation.navigate("Saved");
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
            backgroundColor: "white",
          }}
          keyboardBehavior={"interactive"}
          snapPoints={snapPoints}
          ref={bottomSheetRef}
          enablePanDownToClose={true}
          onClose={() => setModalVisible(false)}
          backgroundStyle={{
            borderRadius: 30,
            backgroundColor: "white",
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
          <BottomSheetView
            style={{
              marginHorizontal: 20,
              marginVertical: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => signOut(auth)}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Feather name="log-out" color="black" size={24} />
              <Text
                style={{
                  color: "black",
                  fontSize: 18,
                  marginLeft: 10,
                  fontWeight: "600",
                }}
              >
                Sign Out
              </Text>
            </TouchableOpacity>
          </BottomSheetView>
          <BottomSheetView
            style={{
              marginHorizontal: 20,
              marginVertical: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => handleSavedPress()}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <Feather name="bookmark" color="black" size={24} />
              <Text
                style={{
                  color: "black",
                  fontSize: 18,
                  marginLeft: 10,
                  fontWeight: "600",
                }}
              >
                Saved
              </Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ProfileModal;
