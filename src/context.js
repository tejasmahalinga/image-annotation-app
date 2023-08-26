import { createContext, useContext, useState } from "react";

const ThemeContext = createContext({});

export const ThemeContextProvider = ({ children }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [allImageBoxList, setAllImageBoxList] = useState([]);

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
