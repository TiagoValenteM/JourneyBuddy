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
    const updatedGuides = [...guides];
    updatedGuides[index] = guide;
    setGuides(updatedGuides);
  }
};

export { updateGuideLocally };
