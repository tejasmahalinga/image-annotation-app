import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useThemeContext } from "../context";
import imagesData from "../data/imagesData.json";
import { Button } from "@mui/material";

const Toolbar = () => {
  const [showPrevButton, setShowPrevButton] = useState(false);
  const [showNextButton, setShowNextButton] = useState(true);
  const { currentImageIndex, setCurrentImageIndex, allImageBoxList } =
    useThemeContext();

  //to handle conditions to show or hide next/previous buttons
  useEffect(() => {
    if (currentImageIndex === imagesData.length - 1) {
      setShowNextButton(false);
    } else if (currentImageIndex === 0) {
      setShowPrevButton(false);
    } else {
      setShowPrevButton(true);
      setShowNextButton(true);
    }
  }, [currentImageIndex]);

  //func to show next image
  const handleNextImage = () => {
    setCurrentImageIndex(currentImageIndex + 1);
    setShowPrevButton(true);
  };

  //func to show previous image
  const handlePreviousImage = () => {
    setCurrentImageIndex(currentImageIndex - 1);
    setShowNextButton(true);
  };

  // function to handle JSON download
  const handleDownloadData = (e) => {
    e.preventDefault();
    let tempData = { ...allImageBoxList };

    for (const [key, value] of Object.entries(tempData)) {
      tempData[key] = value.map((item) => ({
        x1: item.x,
        y1: item.y,
        x2: item.x + item.width,
        y2: item.y + item.height,
      }));
    }

    exportToJson(tempData);
    console.log("tempData>>>>", tempData);
  };

  // function to export data as JSON
  const exportToJson = (data) => {
    downloadFile({
      data: JSON.stringify(data),
      fileName: "imagesBoundingBox.json",
      fileType: "text/json",
    });
  };

  //download file function
  const downloadFile = ({ data, fileName, fileType }) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType });
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };

  // Styled Component for Arrow button
  const ArrowButton = ({ children }) => {
    return (
      <div className="p-4 border border-gray-400 flex justify-center items-center hover:bg-slate-900 cursor-pointer">
        {children}
      </div>
    );
  };

  return (
    <div className="w-full h-11 flex justify-between">
      {showPrevButton ? (
        <div onClick={handlePreviousImage}>
          <ArrowButton>
            <ArrowBackIcon className="text-white" />
          </ArrowButton>
        </div>
      ) : (
        <div className="text-slate-800"> Disabled</div>
      )}

      {showNextButton ? (
        <div onClick={handleNextImage}>
          <ArrowButton>
            <ArrowForwardIcon className="text-white" />
          </ArrowButton>
        </div>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadData}
        >
          Submit Data
        </Button>
      )}
    </div>
  );
};

export default Toolbar;
