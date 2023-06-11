import React, { createContext, useState, useContext, ReactNode } from "react";
import { Guide } from "../models/guides";

interface GuideContextProps {
  pressedGuide: Guide | undefined;
  setPressedGuide: React.Dispatch<React.SetStateAction<Guide | undefined>>;
  guides: Guide[];
  setGuides: React.Dispatch<React.SetStateAction<Guide[]>>;
  tempGuide: Guide | undefined;
  setTempGuide: React.Dispatch<React.SetStateAction<Guide | undefined>>;
}

const GuideContext = createContext<GuideContextProps>({
  pressedGuide: undefined,
  setPressedGuide: () => {},
  guides: [],
  setGuides: () => {},
  tempGuide: undefined,
  setTempGuide: () => {},
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

  return (
    <GuideContext.Provider
      value={{
        pressedGuide,
        setPressedGuide,
        guides,
        setGuides,
        tempGuide,
        setTempGuide,
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
    tempGuide,
    setTempGuide,
  } = useContext(GuideContext);

  return {
    pressedGuide,
    setPressedGuide,
    guides,
    setGuides,
    tempGuide,
    setTempGuide,
  };
}
