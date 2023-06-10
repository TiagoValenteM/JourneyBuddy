import { Text, TouchableOpacity } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import Feather from "react-native-vector-icons/Feather";
import React, { useRef } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

const auth = getAuth();

interface ProfileModalProps {
  setModalVisible: any;
}

const ProfileModal = ({ setModalVisible }: ProfileModalProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["30%"];
  return (
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
          marginVertical: 5,
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
    </BottomSheet>
  );
};

export default ProfileModal;
