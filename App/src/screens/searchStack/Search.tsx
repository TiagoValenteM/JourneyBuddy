import React, { useState } from "react";
import { Text, View, ScrollView, RefreshControl, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import SearchBar from "../../components/searchbar/SearchBar";
import { Feather } from '@expo/vector-icons';


function SearchView<StackScreenProps>({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const [searchForGuides, setSearchForGuides] = useState(true);
  //This useState will be True if I'm searching for guides and will be set to
  //false if I'm searching for People. 
  //Since we only have 2 options(Guides or People) is easier to do it in this way.
  const handleSearch = (query: string) => {
    console.log(`Searching for ${searchForGuides ? 'guides' : 'people'} - Query: ${query}`);

      // Perform search logic based on searchForGuides and query
  if (searchForGuides) {
    // Perform guide search logic
    // You can use a guide-specific API or query here
    // For example: searchGuides(query)
  } else {
    // Perform people search logic
    // You can use a people-specific API or query here
    // For example: searchPeople(query)
  }
};
  return (
    <ScrollView
      style={{ flex: 1, paddingHorizontal: 20 }}
    /*refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }*/
    >
      <View>
        {/*<SearchBar onSearch={handleSearch}/>*/}
        <SearchBar onSearch={handleSearch} searchForGuides={searchForGuides} toggleSearchType={() => setSearchForGuides(!searchForGuides)} />

      </View>

      <View style={styles.GuideContainer}>
        <TouchableOpacity style={searchForGuides ? styles.selectedChoice : styles.choice} /*onPress={toggleSearchType}*/>
          <Feather name="user" size={20} />
          <Text style={styles.TitleChoice}>Guides</Text>
        </TouchableOpacity>

        <TouchableOpacity style={!searchForGuides ? styles.selectedChoice : styles.choice} /*onPress={toggleSearchType}*/>
          <Feather name="user" size={20} />
          <Text style={styles.TitleChoice}>People</Text>
        </TouchableOpacity>

      </View>

    </ScrollView>


  );
}

const styles = StyleSheet.create({
  GuideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    backgroundColor: '#d3d3d3',
    paddingEnd: 70,
    paddingStart: 70,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginHorizontal: 10,
    marginTop: 15,
    marginBottom: 5,
  },
  TitleChoice: {
    fontSize: 20,
  },
  //Title theme
  choice: {
    flexDirection: 'row',
    alignItems: 'center',
    // Add your choice styles here
  },

  selectedChoice: {
    flexDirection: 'row',
    alignItems: 'center',
    // Add your selected choice styles here
  },
})

export default SearchView;

