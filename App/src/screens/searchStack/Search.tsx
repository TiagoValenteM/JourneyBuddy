import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Button,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Guide } from "../../models/guides";
import GuideIdentifier from "../../components/identifiers/GuideIdentifier";
import UserIdentifier from "../../components/identifiers/UserIdentifier";
import UserProfile from "../../models/userProfiles";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";

const TabScreen1 = () => <View style={styles.tabContent}></View>;
const TabScreen2 = () => <View style={styles.tabContent}></View>;

function SearchView({}: { navigation: any }) {
  //const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [searchForGuides, setSearchForGuides] = useState(true);
  const [guides, setGuides] = useState<Guide[] | undefined >([]);
  const [users, setUsers] = useState<UserProfile[] | undefined >([]);

  const getGuides = async (title: string | null): Promise<Guide[]> => {
    try {
      const userGuidesCollectionRef = collection(db, "guides");
      const queryFindGuides = query(
        userGuidesCollectionRef,
        where("title", ">=", title),
        where("title", "<=", title + '\uf8ff')
      );

      const querySnapshotUser = await getDocs(queryFindGuides);

      if (!querySnapshotUser.empty) {
        return querySnapshotUser.docs.map((doc) => doc.data() as Guide);
      } else {
        console.log("No matching user profile found");
        return [];
      }
    } catch (error) {
      console.log("Error retrieving user guides:", error);
      return [];
    }
  };

  // function to retrieve all users
  const getUsers = async (username: string | null): Promise<UserProfile[]> => {
    try {
      const userCollectionRef = collection(db, "user_profiles");
      const queryFindUsers = query(
        userCollectionRef,
        where("username", ">=", username),
        where("username", "<=", username+ '\uf8ff')
      );
      const querySnapshotUser = await getDocs(queryFindUsers);

      if (!querySnapshotUser.empty) {
        return querySnapshotUser.docs.map((doc) => doc.data() as UserProfile);
      } else {
        console.log("No matching user profile found");
        return [];
      }
    } catch (error) {
      console.log("Error retrieving user users:", error);
      return [];
    }
  };

  const SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
      console.log(searchQuery);

      if (searchForGuides) {
        getGuides(searchQuery).then((result) => setGuides(result));
        console.log(guides);
      } else {
        getUsers(searchQuery).then((result) => setUsers(result));
        console.log(users);
      }
    };

    return (
      <View style={stylesSearch.searchBarContainer}>
        <TextInput
          style={stylesSearch.searchInput}
          maxLength={30}
          placeholder="Guides, People ..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />

        <Button title="Search" onPress={handleSearch} />
      </View>
    );
  };

  // updating
  const onRefresh = () => {
    setRefreshing(true);
    setGuides(undefined);
    setUsers(undefined);
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View>
        <SearchBar />
      </View>

      <View style={styles.GuideContainer}>
        <TouchableOpacity
          style={[styles.tabButton, searchForGuides && styles.activeTab]}
          onPress={() => setSearchForGuides(!searchForGuides)}
        >
          <Feather name="map-pin" size={20} />
          <Text style={styles.TitleChoice}>Guides</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, !searchForGuides && styles.activeTab]}
          onPress={() => setSearchForGuides(!searchForGuides)}
        >
          <Feather name="user" size={20} />
          <Text style={styles.TitleChoice}>People</Text>
        </TouchableOpacity>
      </View>

      {searchForGuides && (
        <>
          <TabScreen1 />
          {guides?.length === 0 || guides === undefined ? (
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
          ) : (
            <View>
              {guides
                .filter((guide) => guide.status === "approved")
                .sort((a, b) => (b.dateCreated > a.dateCreated ? 1 : -1))
                .map((guide, index) => (
                  <View
                    key={index}
                    style={{ marginVertical: 10, flexDirection: "row" }}
                  >
                    <View style={{ marginVertical: 5, marginHorizontal: 10 }}>
                      <Image
                        source={{ uri: guide.pictures[0] }}
                        style={{ width: 100, height: 100 }}
                      />
                    </View>
                    <View style={{ marginVertical: 10 }}>
                      <GuideIdentifier guide={guide} />
                    </View>
                  </View>
                ))}
            </View>
          )}
        </>
      )}

      {!searchForGuides && (
        <>
          <TabScreen2 />
          {users?.length === 0 || users === undefined ? (
            <View
              style={{
                flexDirection: "column",
                backgroundColor: "#dfe0e3",
                borderRadius: 10,
                padding: 15,
                marginVertical: 10,
              }}
            >
              <Text style={{ textAlign: "center" }}>No people found</Text>
            </View>
          ) : (
            <View>
              {users.map((user, index) => (
                <View
                  key={index}
                  style={{ marginVertical: 10, flexDirection: "row" }}
                >
                  <View
                    style={{ marginVertical: 5, marginHorizontal: 10 }}
                  ></View>
                  <View style={{ marginVertical: 10 }}>
                    <UserIdentifier
                      key={user.uid}
                      selectedUsername={user.username}
                      selectedUserUid={user.uid}
                      homepage={true}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  GuideContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    //backgroundColor: '#d3d3d3',
    //paddingEnd: 70,
    ////paddingStart: 70,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 15,
    marginBottom: 5,
  },
  TitleChoice: {
    marginTop: 6,
    fontSize: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: "#000000",
  },
  tabContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

const stylesSearch = StyleSheet.create({
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d3d3d3",
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 15,
    marginBottom: 5,
    height: 45,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 18,
  },
  searchButton: {
    marginLeft: 10,
    marginRight: 5,
  },
});

export default SearchView;
