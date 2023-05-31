import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { getAllGuides } from "../services/ManageGuides";
import { Guide } from "../models/guides";

function HomeScreen() {
  const [guides, setGuides] = useState<Guide[]>([]);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const guides = await getAllGuides();
        setGuides(guides);
      } catch (error) {
        console.log("Error fetching guides:", error);
      }
    };

    fetchGuides();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {guides.map((guide) => (
        <Text key={guide.uid}>{guide.title}</Text>
      ))}
    </View>
  );
}

export default HomeScreen;
