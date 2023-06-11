import React from "react";
import { RefreshControl, ScrollView, View, Text } from "react-native";
import ProfileModal from "../../components/modals/ProfileModal";
import { getGuidesUser } from "../../services/ManageGuides";
import GridImage from "../../components/grids/GridImage";
import ProfileIdentifier from "../../components/identifiers/ProfileIdentifier";
import { useCurrentUser } from "../../context/currentUserContext";
import { useAuthenticatedUser } from "../../context/authenticatedUserContext";
import { useGuide } from "../../context/GuideContext";
import { useLoading } from "../../hooks/useLoading";
import { useError } from "../../hooks/useError";

interface ProfileScreenProps {
  navigation: any;
  isAuthUser: boolean;
  modalVisible?: boolean;
  setModalVisible?: any;
}

function ProfileView({
  navigation,
  isAuthUser,
  modalVisible,
  setModalVisible,
}: ProfileScreenProps) {
  const { currentUser } = useCurrentUser();
  const { authenticatedUser } = useAuthenticatedUser();
  const [refreshing, setRefreshing] = React.useState(false);
  const { selectedUserGuides, setSelectedUserGuides, guides } = useGuide();
  const { startLoading, stopLoading } = useLoading();
  const { showError } = useError();

  const onRefresh = () => {
    setRefreshing(true);
    getGuidesUser(currentUser?.uid)
      .then((fetchedGuides) => {
        setSelectedUserGuides(fetchedGuides);
        setRefreshing(false);
      })
      .catch((err) => {
        showError("Failed to load guides. Please try again later.");
        console.log("Error fetching user guides:", err);
      });
  };

  React.useEffect(() => {
    startLoading();
    getGuidesUser(currentUser?.uid)
      .then((fetchedGuides) => {
        setSelectedUserGuides(fetchedGuides);
        stopLoading();
      })
      .catch((err) => {
        showError("Failed to load guides. Please try again later.");
        console.log("Error fetching user guides:", err);
      });
  }, []);

  return authenticatedUser ? (
    <View style={{ height: "100%", flex: 1 }}>
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ProfileIdentifier navigation={navigation} isAuthUser={isAuthUser} />

        {isAuthUser && authenticatedUser?.guides?.length > 0 && (
          <GridImage
            guides={guides}
            navigation={navigation}
            authUser={authenticatedUser!}
          />
        )}

        {!isAuthUser && selectedUserGuides?.length > 0 && (
          <GridImage
            guides={selectedUserGuides}
            navigation={navigation}
            authUser={authenticatedUser!}
          />
        )}

        {(!isAuthUser && selectedUserGuides?.length === 0) ||
          (isAuthUser && authenticatedUser?.guides.length === 0 && (
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
          ))}
      </ScrollView>
      {modalVisible && <ProfileModal setModalVisible={setModalVisible} />}
    </View>
  ) : (
    <View />
  );
}

export default ProfileView;
