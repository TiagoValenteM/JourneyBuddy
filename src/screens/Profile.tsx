import React from "react";
import { RefreshControl, ScrollView } from "react-native";
import MenuModal from "../components/modals/MenuModal";
import { getGuidesCurrentUser } from "../services/ManageGuides";
import { Guide } from "../models/guides";
import GridImage from "../components/grids/GridImage";
import ProfileIdentifier from "../components/identifiers/ProfileIdentifier";
import { useCurrentUser } from "../context/currentUserContext";
import { useAuthenticatedUser } from "../context/authenticatedUserContext";
import { usePressedGuide } from "../context/pressedGuideContext";

interface ProfileScreenProps {
  navigation: any;
  modalVisible: boolean;
  setModalVisible: any;
  isAuthUser: boolean;
}

function ProfileScreen({
  navigation,
  modalVisible,
  setModalVisible,
  isAuthUser,
}: ProfileScreenProps) {
  const { currentUser } = useCurrentUser();
  const { authenticatedUser } = useAuthenticatedUser();
  const [refreshing, setRefreshing] = React.useState(false);
  const { guides, setGuides } = usePressedGuide();

  const onRefresh = async () => {
    setRefreshing(true);

    const fetchUserGuides = async () => {
      try {
        let fetchedGuides: Guide[];

        if (isAuthUser) {
          fetchedGuides = await getGuidesCurrentUser(authenticatedUser!);
        } else {
          fetchedGuides = await getGuidesCurrentUser(currentUser!);
        }

        setGuides(fetchedGuides);
      } catch (error) {
        console.log("Error fetching user guides:", error);
      }

      setRefreshing(false);
    };

    await fetchUserGuides();
  };

  React.useEffect(() => {
    onRefresh();
  }, [currentUser]);

  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ProfileIdentifier navigation={navigation} isAuthUser={isAuthUser} />
      <GridImage guides={guides} navigation={navigation} />
      <MenuModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </ScrollView>
  );
}

export default ProfileScreen;
