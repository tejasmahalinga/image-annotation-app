import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useThemeContext } from "../context";

const Toolbar = () => {
  const { currentImageIndex, setCurrentImageIndex } = useThemeContext();
  const handleNextImage = () => {
    if (currentImageIndex === 4) {
      setCurrentImageIndex(0);
    } else {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    // setSelectedImage(imagesList);
  };
  const handlePreviousImage = () => {
    console.log("prevvv>>>");
    if (currentImageIndex <= 0) {
      setCurrentImageIndex(4);
    } else {
      setCurrentImageIndex(currentImageIndex - 1);
    }
    // setSelectedImage(imagesList);
  };

  const ArrowButton = ({ children }) => {
    return (
      <div className="p-4 border border-gray-400 flex justify-center items-center hover:bg-slate-900 cursor-pointer">
        {children}
      </div>
    );
  };

  return (
    <div className="w-full h-11 flex justify-between">
      <div onClick={handlePreviousImage}>
        <ArrowButton>
          <ArrowBackIcon className="text-white" />
        </ArrowButton>
      </div>
      <div onClick={handleNextImage}>
        <ArrowButton>
          <ArrowForwardIcon className="text-white" />
        </ArrowButton>
      </div>
    </div>
  );
};

export default Toolbar;
