import React from "react";
import { RefreshControl, ScrollView, View, Text } from "react-native";
import ProfileModal from "../../components/modals/ProfileModal";
import { getGuidesCurrentUser } from "../../services/ManageGuides";
import GridImage from "../../components/grids/GridImage";
import ProfileIdentifier from "../../components/identifiers/ProfileIdentifier";
import { useCurrentUser } from "../../context/currentUserContext";
import { useAuthenticatedUser } from "../../context/authenticatedUserContext";
import { useGuide } from "../../context/GuideContext";

interface ProfileScreenProps {
  navigation: any;
  modalVisible: boolean;
  setModalVisible: any;
  isAuthUser: boolean;
}

function ProfileView({
  navigation,
  modalVisible,
  setModalVisible,
  isAuthUser,
}: ProfileScreenProps) {
  const { currentUser } = useCurrentUser();
  const { authenticatedUser } = useAuthenticatedUser();
  const [refreshing, setRefreshing] = React.useState(false);
  const { guides, setGuides } = useGuide();

  const onRefresh = () => {
    setRefreshing(true);

    getGuidesCurrentUser(isAuthUser ? authenticatedUser! : currentUser!)
      .then((fetchedGuides) => {
        setGuides(fetchedGuides);
        setRefreshing(false);
      })
      .catch((err) => {
        console.log("Error fetching user guides:", err);
      });
  };

  React.useEffect(() => {
    onRefresh();
  }, [currentUser]);

  return (
    <View style={{ height: "100%", flex: 1 }}>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ProfileIdentifier navigation={navigation} isAuthUser={isAuthUser} />
        {guides?.length > 0 ? (
          <GridImage guides={guides} navigation={navigation} />
        ) : (
          <View
            style={{
              flexDirection: "column",
              backgroundColor: "#dfe0e3",
              borderRadius: 10,
              padding: 15,
              marginVertical: 10,
            }}
          >
            <Text style={{ textAlign: "center" }}>No guides found</Text>
          </View>
        )}
      </ScrollView>
      <ProfileModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
}

export default ProfileView;
