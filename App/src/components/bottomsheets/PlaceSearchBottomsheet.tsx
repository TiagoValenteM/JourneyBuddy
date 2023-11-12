import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { Guide, Place } from "../../models/guides";
import { Map, PlusCircle } from "react-native-feather";
import Colors from "../../../styles/colorScheme";

interface SelectLocationModalProps {
  modalVisible: boolean;
  setModalVisible: any;
  placesArray: Place[] | undefined;
  setLocationName: any;
  setMarkerCoordinate: any;
}

const PlaceSearchBottomsheet = ({
  modalVisible,
  setModalVisible,
  placesArray,
  setLocationName,
  setMarkerCoordinate,
}: SelectLocationModalProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["50%", "80%"];

  const data = placesArray;
  const keyExtractor = (item: Place) => item.name;
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.containerRow} key={keyExtractor(item)}>
      <TouchableOpacity
        onPress={() => {
          setLocationName(item.name);
          setMarkerCoordinate({
            latitude: item.coordinates?.latitude,
            longitude: item.coordinates?.longitude,
          });
          setModalVisible(false);
        }}
        style={styles.container}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "600",
            overflow: "hidden",
            width: "100%",
          }}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>
        <View style={styles.coordinatesContainer}>
          <Map width={18} height={18} color={"#007AFF"} />
          <Text style={styles.coordinates}>
            ({item.coordinates?.latitude.toString().slice(0, 8)},{" "}
            {item.coordinates?.longitude.toString().slice(0, 8)})
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.unsavedContainer}>
        <TouchableOpacity onPress={() => {}} style={styles.saveButton}>
          <PlusCircle width={30} height={30} color={Colors.blue} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return modalVisible ? (
    <BottomSheet
      style={styles.bottomSheet}
      keyboardBehavior={"interactive"}
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      enablePanDownToClose={true}
      onClose={() => setModalVisible(false)}
      backgroundStyle={styles.bottomSheet}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <FlatList<Guide | Place>
        style={styles.bottomSheetScrollView}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={() => <Text style={styles.title}>Places</Text>}
      />
    </BottomSheet>
  ) : null;
};

export default PlaceSearchBottomsheet;

const styles = StyleSheet.create({
  bottomSheetScrollView: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  bottomSheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
  },
  handleIndicator: {
    width: 50,
    height: 5,
    backgroundColor: "#dfe0e3",
    alignSelf: "center",
    marginVertical: 10,
    borderRadius: 20,
  },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 10 },
  container: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    maxWidth: "80%",
  },
  containerRow: {
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    borderBottomWidth: 2,
    borderBottomColor: Colors.lightGray,
    width: "100%",
    marginVertical: 15,
  },
  coordinatesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  coordinates: {
    fontSize: 13,
    marginHorizontal: 5,
  },
  unsavedContainer: {
    paddingHorizontal: 8,
  },
  saveButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});
