import React, { createContext, useState, useContext, ReactNode } from "react";
import { Guide } from "../models/guides";

interface PressedGuideContextProps {
  pressedGuide: Guide | undefined;
  setPressedGuide: React.Dispatch<React.SetStateAction<Guide | undefined>>;
  guides: Guide[];
  setGuides: React.Dispatch<React.SetStateAction<Guide[]>>;
}

const PressedGuideContext = createContext<PressedGuideContextProps>({
  pressedGuide: undefined,
  setPressedGuide: () => {},
  guides: [],
  setGuides: () => {},
});

interface PressedGuideProviderProps {
  children: ReactNode;
}

export function PressedGuideProvider({ children }: PressedGuideProviderProps) {
  const [pressedGuide, setPressedGuide] = useState<Guide | undefined>(
    undefined
  );
  const [guides, setGuides] = useState<Guide[]>([]);

  return (
    <PressedGuideContext.Provider
      value={{ pressedGuide, setPressedGuide, guides, setGuides }}
    >
      {children}
    </PressedGuideContext.Provider>
  );
}

export function usePressedGuide() {
  const { pressedGuide, setPressedGuide, guides, setGuides } =
    useContext(PressedGuideContext);

  return { pressedGuide, setPressedGuide, guides, setGuides };
}
