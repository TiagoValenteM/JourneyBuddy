import {
  Alert,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import React, { useRef } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { checkSelectGuide, deleteGuide } from "../../services/ManageGuides";
import { useAuthenticatedUser } from "../../context/authenticatedUserContext";
import { Guide } from "../../models/guides";
import { useError } from "../../hooks/useError";

interface GuideOptionsModalProps {
  navigation: any;
  setModalVisible: any;
  guideUid: string;
  guides: Guide[];
  setGuides: any;
}

const GuideOptionsModal = ({
  navigation,
  setModalVisible,
  guideUid,
  guides,
  setGuides,
}: GuideOptionsModalProps) => {
  const { authenticatedUser, setAuthenticatedUser } = useAuthenticatedUser();
  const { showError } = useError();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["30%", "50%"];

  const handleBackdropPress = () => {
    bottomSheetRef.current?.close();
    setModalVisible(false);
  };

  const handleDelete = (guideId: string) => {
    Alert.alert("Delete Guide", "Are you sure you want to delete this guide?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteGuide(
              guideId,
              authenticatedUser,
              setAuthenticatedUser,
              guides,
              setGuides,
              showError
            )
              .then(() => {
                setModalVisible(false);
                bottomSheetRef.current?.close();
              })
              .finally(() => {
                navigation.removeListener;
                navigation.navigate("Profile");
              });
          } catch (error) {
            console.error("Error deleting guide:", error);
            showError("Error deleting guide. Please try again later.");
          }
        },
      },
    ]);
  };

  const Option = (
    iconName: string,
    iconColor: string,
    text: string,
    onPress: any,
    children?: React.ReactNode
  ) => {
    return (
      <BottomSheetView
        style={{
          marginHorizontal: 20,
          marginVertical: 10,
        }}
      >
        <Pressable
          onPress={() => {
            onPress();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Feather name={iconName} color={iconColor} size={25} />
          <Text
            style={{
              color: iconColor,
              fontSize: 18,
              marginLeft: 10,
              fontWeight: "600",
            }}
          >
            {text}
          </Text>
        </Pressable>
        {children}
      </BottomSheetView>
    );
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
          {Option(
            "bookmark",
            "black",
            authenticatedUser?.savedGuides?.some(
              (guideUID) => guideUID === guideUid
            )
              ? "Saved"
              : "Save",
            () => {
              checkSelectGuide(
                guideUid,
                authenticatedUser,
                setAuthenticatedUser
              );
              setModalVisible(false);
              bottomSheetRef.current?.close();
            },
            authenticatedUser?.savedGuides?.some(
              (guideUID) => guideUID === guideUid
            ) ? (
              <Feather
                name={"x"}
                size={13}
                color="black"
                style={{
                  zIndex: 1,
                  position: "absolute",
                  top: 4,
                  left: 6,
                }}
              />
            ) : null
          )}

          {Option("edit", "black", "Edit", () =>
            navigation.navigate("EditGuideScreen")
          )}
          {Option("trash", "#fb4342", "Delete", () => handleDelete(guideUid))}
        </BottomSheet>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default GuideOptionsModal;
