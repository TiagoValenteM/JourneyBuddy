import React, { useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { Guide, Place } from "../../models/guides";
import { Text, View, StyleSheet, FlatList } from "react-native";
import GuideIdentifier from "../identifiers/GuideIdentifier";
import LocationIdentifier from "../identifiers/LocationIdentifier";

interface ProfileModalProps {
  navigation?: any;
  guides?: Guide[];
  places?: Place[];
  title?: string;
}

const SavedModal = ({
  navigation,
  guides,
  places,
  title,
}: ProfileModalProps) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["15%", "40%", "80%"];

  const data = guides || places;
  const keyExtractor = (item: any) => (guides ? item.uid : item.name);
  const renderItem = ({ item }: { item: any }) => (
    <View style={ModalStyles.container} key={keyExtractor(item)}>
      {guides ? (
        <GuideIdentifier guide={item} navigation={navigation} />
      ) : (
        <LocationIdentifier place={item} />
      )}
    </View>
  );

  return (
    <BottomSheet
      style={ModalStyles.bottomSheet}
      keyboardBehavior={"interactive"}
      snapPoints={snapPoints}
      ref={bottomSheetRef}
      enablePanDownToClose={false}
      backgroundStyle={ModalStyles.bottomSheet}
      handleIndicatorStyle={ModalStyles.handleIndicator}
    >
      <FlatList<Guide | Place>
        style={ModalStyles.bottomSheetScrollView}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <Text style={ModalStyles.title}>
            {title || "Saved " + (guides ? "Guides" : "Places")}
          </Text>
        )}
      />
    </BottomSheet>
  );
};
export default SavedModal;

const ModalStyles = StyleSheet.create({
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
    marginVertical: 10,
    borderBottomColor: "#dfe0e3",
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
});
