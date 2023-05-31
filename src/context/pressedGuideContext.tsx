import React, { createContext, useState, useContext, ReactNode } from "react";
import { Guide } from "../models/guides";

interface PressedGuideContextProps {
  pressedGuide: Guide | undefined;
  setPressedGuide: React.Dispatch<React.SetStateAction<Guide | undefined>>;
}

const PressedGuideContext = createContext<PressedGuideContextProps>({
  pressedGuide: undefined,
  setPressedGuide: () => {},
});

interface PressedGuideProviderProps {
  children: ReactNode;
}

export function PressedGuideProvider({ children }: PressedGuideProviderProps) {
  const [pressedGuide, setPressedGuide] = useState<Guide | undefined>(
    undefined
  );

  return (
    <PressedGuideContext.Provider value={{ pressedGuide, setPressedGuide }}>
      {children}
    </PressedGuideContext.Provider>
  );
}

export function usePressedGuide() {
  const { pressedGuide, setPressedGuide } = useContext(PressedGuideContext);

  return { pressedGuide, setPressedGuide };
}
