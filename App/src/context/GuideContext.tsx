import React, { createContext, useState, useContext, ReactNode } from "react";
import { Guide, Place } from "../models/guides";

interface GuideContextProps {
  pressedGuide: Guide | undefined;
  setPressedGuide: React.Dispatch<React.SetStateAction<Guide | undefined>>;
  guides: Guide[];
  setGuides: React.Dispatch<React.SetStateAction<Guide[]>>;
  selectedUserGuides: Guide[];
  setSelectedUserGuides: React.Dispatch<React.SetStateAction<Guide[]>>;
  tempGuide: Guide | undefined;
  setTempGuide: React.Dispatch<React.SetStateAction<Guide | undefined>>;
  selectedPlace: Place | null;
  setSelectedPlace: React.Dispatch<React.SetStateAction<Place | null>>;
}

const GuideContext = createContext<GuideContextProps>({
  pressedGuide: undefined,
  setPressedGuide: () => {},
  guides: [],
  setGuides: () => {},
  selectedUserGuides: [],
  setSelectedUserGuides: () => {},
  tempGuide: undefined,
  setTempGuide: () => {},
  selectedPlace: null,
  setSelectedPlace: () => {},
});

interface GuideProviderProps {
  children: ReactNode;
}

export function GuideProvider({ children }: GuideProviderProps) {
  const [pressedGuide, setPressedGuide] = useState<Guide | undefined>(
    undefined
  );
  const [guides, setGuides] = useState<Guide[]>([]);
  const [tempGuide, setTempGuide] = useState<Guide | undefined>(undefined);
  const [selectedUserGuides, setSelectedUserGuides] = useState<Guide[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  return (
    <GuideContext.Provider
      value={{
        pressedGuide,
        setPressedGuide,
        guides,
        setGuides,
        selectedUserGuides,
        setSelectedUserGuides,
        tempGuide,
        setTempGuide,
        selectedPlace,
        setSelectedPlace,
      }}
    >
      {children}
    </GuideContext.Provider>
  );
}

export function useGuide() {
  const {
    pressedGuide,
    setPressedGuide,
    guides,
    setGuides,
    selectedUserGuides,
    setSelectedUserGuides,
    tempGuide,
    setTempGuide,
    selectedPlace,
    setSelectedPlace,
  } = useContext(GuideContext);

  return {
    pressedGuide,
    setPressedGuide,
    guides,
    setGuides,
    selectedUserGuides,
    setSelectedUserGuides,
    tempGuide,
    setTempGuide,
    selectedPlace,
    setSelectedPlace,
  };
}
