import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

interface SelectLocationModalProps {
  modalVisible: boolean;
  setModalVisible: any;
  locationList: Array<any>;
  setLocationName: any;
  setMarkerCoordinate: any;
}
const SelectLocationModal = ({
  modalVisible,
  setModalVisible,
  locationList,
  setLocationName,
  setMarkerCoordinate,
}: SelectLocationModalProps) => {
  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <TouchableOpacity
        onPress={() => setModalVisible(!modalVisible)}
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <View
          style={{
            height: "70%",
            marginTop: "auto",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          <LinearGradient
            colors={["#141e30", "#243b55"]}
            style={{ flex: 1, borderRadius: 20 }}
          >
            {locationList &&
              locationList.map((item, index) => {
                if (index < 5) {
                  return (
                    <Pressable
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
                        backgroundColor: "rgba(0,0,0,0.5)",
                        padding: 10,
                        marginHorizontal: 20,
                        marginTop: 25,
                        borderRadius: 20,
                      }}
                    >
                      <Text
                        key={item.place_id}
                        style={{
                          color: "white",
                          fontSize: 13,
                          margin: 10,
                          fontWeight: "500",
                          textAlign: "justify",
                        }}
                      >
                        {item.display_name}
                      </Text>
                    </Pressable>
                  );
                }
                return null;
              })}
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SelectLocationModal;
