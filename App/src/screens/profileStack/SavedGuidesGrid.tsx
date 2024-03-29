import React from "react";
import { RefreshControl, SafeAreaView, ScrollView } from "react-native";
import { Guide } from "../../models/guides";
import GridImage from "../../components/grids/GridImage";
import { useAuthenticatedUser } from "../../context/authenticatedUserContext";
import { getSavedGuides } from "../../services/ManageGuides";
import { useError } from "../../hooks/useError";
import Header from "../../components/headers/Header";

interface SavedGuidesGridViewProps {
  navigation: any;
  route: any;
}

const SavedGuidesGridView = ({
  navigation,
  route,
}: SavedGuidesGridViewProps) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const { authenticatedUser } = useAuthenticatedUser();
  const { showError } = useError();
  const [savedGuides, setSavedGuides] = React.useState([] as Guide[]);
  const { guides } = route.params as {
    guides: Guide[];
  };

  const onRefresh = () => {
    setRefreshing(true);
    getSavedGuides(authenticatedUser?.savedGuides)
      .then((fetchedGuides) => {
        setSavedGuides(fetchedGuides);
        setRefreshing(false);
      })
      .catch((err) => {
        showError("Failed to load saved guides. Please try again later.");
        console.log("Error fetching saved guides:", err);
        setRefreshing(false);
      });
  };

  React.useEffect(() => {
    if (savedGuides.length === 0) {
      setSavedGuides(guides);
    }
  }, [guides]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title={"Saved Guides"}
        navigation={navigation}
        backButton={true}
      />
      <ScrollView
        style={{
          paddingHorizontal: 15,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <GridImage
          guides={savedGuides}
          navigation={navigation}
          allowSaving={true}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SavedGuidesGridView;
