import React, { createContext, useState, useContext, ReactNode } from "react";
import { Guide } from "../models/guides";

interface GuideContextProps {
  pressedGuide: Guide | undefined;
  setPressedGuide: React.Dispatch<React.SetStateAction<Guide | undefined>>;
  guides: Guide[];
  setGuides: React.Dispatch<React.SetStateAction<Guide[]>>;
}

const GuideContext = createContext<GuideContextProps>({
  pressedGuide: undefined,
  setPressedGuide: () => {},
  guides: [],
  setGuides: () => {},
});

interface GuideProviderProps {
  children: ReactNode;
}

export function GuideProvider({ children }: GuideProviderProps) {
  const [pressedGuide, setPressedGuide] = useState<Guide | undefined>(
    undefined
  );
  const [guides, setGuides] = useState<Guide[]>([]);

  return (
    <GuideContext.Provider
      value={{ pressedGuide, setPressedGuide, guides, setGuides }}
    >
      {children}
    </GuideContext.Provider>
  );
}

export function useGuide() {
  const { pressedGuide, setPressedGuide, guides, setGuides } =
    useContext(GuideContext);

  return { pressedGuide, setPressedGuide, guides, setGuides };
}
