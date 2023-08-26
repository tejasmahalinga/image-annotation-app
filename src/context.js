import { createContext, useContext, useState } from "react";

const ThemeContext = createContext({});

export const ThemeContextProvider = ({ children }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  return (
    <ThemeContext.Provider
      value={{
        currentImageIndex,
        setCurrentImageIndex,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);