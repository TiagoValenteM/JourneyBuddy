import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, RefreshControl, TouchableOpacity, StyleSheet, Image } from "react-native";
import SearchBar from "../../components/searchbar/SearchBar";
import { Feather } from '@expo/vector-icons';
import { getAllGuides } from "../../services/ManageGuides";
import { Guide } from "../../models/guides";
import { useGuide } from "../../context/GuideContext";
import GuideIdentifier from "../../components/identifiers/GuideIdentifier";
import UserIdentifier from "../../components/identifiers/UserIdentifier";
import UserProfile from "../../models/userProfiles";
import { useCurrentUser } from "../../context/currentUserContext";
import { getUsername, getUserByUID } from "../../database/userRepository";
import { User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";


const TabScreen1 = ({ searchResults }: { searchResults: string[] }) => (
  <View style={styles.tabContent}>
    {searchResults.map((result, index) => (
      <Text key={index}>{result}</Text>
    ))}
  </View>
);

const TabScreen2 = ({ searchResults }: { searchResults: string[] }) => (
  <View style={styles.tabContent}>
    {searchResults.map((result, index) => (
      <Text key={index}>{result}</Text>
    ))}
  </View>
);

function SearchView({ navigation }: { navigation: any }) {
  //const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [searchForGuides, setSearchForGuides] = useState(true);
  const [guideSearchResults, setGuideSearchResults] = useState<string[]>([]);
  const [peopleSearchResults, setPeopleSearchResults] = useState<string[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);


  //logic - setSearchForGuides(!searchForGuides)

  const handleSearch = (query: string) => {
    console.log(`Searching for ${searchForGuides ? 'guides' : 'people'} - Query: ${query}`);

    if (searchForGuides) {
      // Perform guide search logic and set the search results
      const results = ['guide found']; // Replace with your guide search logic
      setGuideSearchResults(results);
    } else {
      // Perform people search logic and set the search results
      const results = ['person found']; // Replace with your people search logic
      setPeopleSearchResults(results);
    }
  };

  //fetching guides
  const fetchGuides = async () => {
    try {
      const guides = await getAllGuides();
      setGuides(guides);
    } catch (error) {
      console.log("Error fetching guides:", error);
    } finally {
      setRefreshing(false);
    }
  };  

  //fetching people
  const fetchUsers = async () => {
    try {
      const users = await getAllUsers();
      setUsers(users);
      console.log("Users:", users);
    } catch (error) {
      console.log("Error fetching users:", error);
    } finally {
      setRefreshing(false);
    }
    };


  // function to retrieve all users
  const getAllUsers = async (): Promise<UserProfile[]> => {
    try {
      const userCollectionRef = collection(db, "users");
      const querySnapshotUser = await getDocs(userCollectionRef);
  
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
    
  // awaiting fetching
  React.useEffect(() => {
    const fetchData = async () => {
      setRefreshing(true);
      await fetchGuides();
      await fetchUsers();
    };

    fetchData().then();
  }, []);


  // updating
  const onRefresh = () => {
    setRefreshing(true);
    fetchGuides().then();
    fetchUsers().then();
  };


  const [activeTab, setActiveTab] = useState('Tab1');

  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: 20 }}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
    >
      <View>
  
        <SearchBar onSearch={handleSearch}/>
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
          <TabScreen1 searchResults={guideSearchResults} />
          {guideSearchResults.length === 0 ? (
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
                  <View key={index} style={{ marginVertical: 10, flexDirection:'row'}}>
                    <View style={{ marginVertical: 5, marginHorizontal: 10}}>
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
          <TabScreen2 searchResults={peopleSearchResults} />
          {peopleSearchResults.length === 0 ? (
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
              {users
                .map((user, index) => (
                  <View key={index} style={{ marginVertical: 10, flexDirection:'row'}}>
                    <View style={{ marginVertical: 5, marginHorizontal: 10}}>
                      <Image
                        source={{ uri: user.profilePicturePath }}
                        style={{ width: 100, height: 100 }}
                      />
                    </View>
                    <View style={{ marginVertical: 10 }}>
                      <UserIdentifier key={user.uid} selectedUsername={user.username} selectedUserUid={user.uid} homepage={false} />
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
    flexDirection: 'row',
    alignItems: 'center',
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
    alignItems: 'center',
    paddingVertical: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#000000',
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default SearchView;

