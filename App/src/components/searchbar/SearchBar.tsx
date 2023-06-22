import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';


interface SearchBarProps {
    onSearch: (query: string) => void;
    //Will take a query Str as an Arg and performs the search Logic
    searchForGuides: boolean;
    //Guides(True) / People(False)
    toggleSearchType: () => void;
    //Toggles the Search Type Between Guides and People
    //-> Remember that if the function is in Guides is suppose to Change it only when you click in People
  }
  
  const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchForGuides, toggleSearchType }) => {
  const [searchQuery, setSearchQuery] = useState('');
  //Receive the Props
  //Extract Props for simple usage
  //UseState manage the SearchQuery state, that represent the current search entered

  const handleSearch = () => {
    onSearch(searchQuery);
    //Invokes on search(SearchQuery => ARG)
  };


  return (
    <View style={styles.searchBarContainer}>    
      <TextInput style={styles.searchInput}
        maxLength={25}
        placeholder="Search"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}

      />
    
      <Button title="Search" onPress={handleSearch} />
    </View>
  );
};

const styles=StyleSheet.create({
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d3d3d3',
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
})

export default SearchBar;