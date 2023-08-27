import { createContext, useContext, useState } from "react";
import imageData from "./data/imagesData.json";

const ThemeContext = createContext({});

export const ThemeContextProvider = ({ children }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImageBoxList, setAllImageBoxList] = useState({});

  return (
    <ThemeContext.Provider
      value={{
        currentImageIndex,
        setCurrentImageIndex,
        allImageBoxList,
        setAllImageBoxList,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
