import ImageAnnotationCanvas from "./components/ImageAnnotationCanvas";
import Toolbar from "./components/Toolbar";
import { useThemeContext } from "./context";
import ImagesData from "./data/imagesData.json";

function App() {
  const { currentImageIndex } = useThemeContext();

  return (
    <div className="flex justify-center items-center w-full min-h-screen flex-col p-10 bg-slate-800 gap-8">
      <div className="text-white font-semibold text-3xl">
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
