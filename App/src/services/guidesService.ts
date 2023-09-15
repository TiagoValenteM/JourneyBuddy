import { Guide } from "../models/guides";
import React from "react";

const updateGuideLocally = async (
  guide: Guide,
  guides: Guide[],
  setGuides: React.Dispatch<React.SetStateAction<Guide[]>>
) => {
  const index = guides.findIndex(
    (guideToFind) => guideToFind.uid === guide.uid
  );

  if (index !== -1) {
    // If the guide is found locally, update it in the local guides array
    const updatedGuides = [...guides];
    updatedGuides[index] = guide;

    console.log(updatedGuides);

    // Update the local state variable with the updated guides array
    setGuides(updatedGuides);
  }
};

export { updateGuideLocally };
