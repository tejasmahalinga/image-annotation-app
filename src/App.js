import logo from "./logo.svg";
import "./App.css";
import ImageAnnotationCanvas from "./components/ImageAnnotationCanvas";
import image1 from "./assets/Image 1.jpg";
import { useCallback, useEffect, useState } from "react";
import Toolbar from "./components/Toolbar";
import { useThemeContext } from "./context";
import ImagesData from "./data/imagesData.json";

function App() {
  const { currentImageIndex, setCurrentImageIndex } = useThemeContext();

  return (
    <div className="flex justify-center items-center w-full h-screen flex-col p-20 bg-slate-800">
      <div className="text-white font-semibold text-2xl">
        Image Annotation Tool
      </div>
      <Toolbar />
      {currentImageIndex >= 0 ? (
        <ImageAnnotationCanvas
          selectedImageData={ImagesData[currentImageIndex]}
        />
      ) : null}
    </div>
  );
}

export default App;
