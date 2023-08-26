import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, Layer, Rect, Stage } from "react-konva";
import useImage from "use-image";

const ImageAnnotationCanvas = ({ selectedImageData }) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [boundingBoxList, setBoundingBoxList] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [stageRef, setStageRef] = useState(null);
  const [image] = useImage(selectedImageData.url);
  console.log("selectedImageData", selectedImageData);
  //   const stageRef = useRef();

  const canvasWidth = 800;
  const canvasHeight = 500;

  const handleMouseDown = () => {
    setIsDrawing(true);
    const stage = stageRef.getStage();
    const pointerPos = stage.getPointerPosition();
    const newBox = {
      x: pointerPos.x,
      y: pointerPos.y,
      width: 0,
      height: 0,
    };
    setBoundingBoxList([...boundingBoxList, newBox]);
  };

  const handleMouseMove = () => {
    if (!isDrawing) {
      return;
    }
    let tempBoxList = [...boundingBoxList];
    const stage = stageRef.getStage();
    const pointerPos = stage.getPointerPosition();
    const updatedBox = { ...tempBoxList[tempBoxList.length - 1] };
    updatedBox.width = pointerPos.x - updatedBox.x;
    updatedBox.height = pointerPos.y - updatedBox.y;
    tempBoxList[tempBoxList.length - 1] = updatedBox;
    setBoundingBoxList(tempBoxList);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  console.log("boxes>>>", boundingBoxList);

  return (
    <div>
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={(node) => setStageRef(node)}
      >
        <Layer>
          <Rect
            width={canvasWidth}
            height={canvasHeight}
            fillPatternImage={image}
            //   fill="transparent"
          />
          {boundingBoxList.map((box, index) => (
            <Rect
              key={index}
              x={box.x}
              y={box.y}
              width={box.width}
              height={box.height}
              stroke="red"
              strokeWidth={2}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default ImageAnnotationCanvas;
