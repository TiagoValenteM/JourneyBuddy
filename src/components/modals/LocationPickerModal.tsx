import { Text, TouchableOpacity } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";

interface SelectLocationModalProps {
  modalVisible: boolean;
  setModalVisible: any;
  locationList: Array<any>;
  setLocationName: any;
  setMarkerCoordinate: any;
}

const LocationPickerModal = ({
  modalVisible,
  setModalVisible,
  locationList,
  setLocationName,
  setMarkerCoordinate,
}: SelectLocationModalProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["50%", "80%"];

  return modalVisible ? (
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
      <BottomSheetScrollView>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            marginVertical: 10,
            marginHorizontal: 20,
          }}
        >
          Locations
        </Text>
        {locationList &&
          locationList.map((item, index) => {
            if (index < 15) {
              return (
                <TouchableOpacity
                  key={item.place_id}
                  onPress={() => {
                    setLocationName(item.display_name);
                    setMarkerCoordinate({
                      latitude: item.lat,
                      longitude: item.lon,
                    });
                    setModalVisible(false);
                  }}
                  style={{
                    backgroundColor: "#dfe0e3",
                    padding: 10,
                    marginHorizontal: 20,
                    marginVertical: 12,
                    borderRadius: 15,
                  }}
                >
                  <Text
                    key={item.place_id}
                    style={{
                      fontSize: 13,
                      margin: 10,
                      fontWeight: "500",
                      textAlign: "justify",
                    }}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item.display_name}
                  </Text>
                </TouchableOpacity>
              );
            }
            return null;
          })}
      </BottomSheetScrollView>
    </BottomSheet>
  ) : null;
};

export default LocationPickerModal;
