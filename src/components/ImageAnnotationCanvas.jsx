import { Close } from "@mui/icons-material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Group,
  Image,
  Layer,
  Rect,
  Stage,
  Transformer,
  Text,
} from "react-konva";
import useImage from "use-image";

const ImageAnnotationCanvas = ({ selectedImageData }) => {
  const [boundingBoxList, setBoundingBoxList] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [stageRef, setStageRef] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedBoxTemp, setSelectedBoxTemp] = useState(null);
  const [image] = useImage(selectedImageData.url);
  console.log("selectedImageData", selectedImageData);
  //   const stageRef = useRef();

  const canvasWidth = 800;
  const canvasHeight = 500;

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    console.log("e.target.getStage()>>", e.target.getStage());
    const clickedOnEmpty = e.target === e.target.getStage();
    console.log("empty>>>", clickedOnEmpty);
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
    return clickedOnEmpty;
  };

  console.log("selectId>>", selectedId);

  const handleRemoveBox = (selectedId) => {
    let tempList = [...boundingBoxList].filter(
      (item) => !(item.id === selectedId)
    );
    console.log("templISTT>>>>", tempList);
    setBoundingBoxList(tempList);

    console.log("cancel>>>");
  };

  console.log("selected delete>>>>> global list", boundingBoxList);

  const handleMouseDown = (tempSelectedBox) => {
    // const clickedOnEmpty = checkDeselect(e);
    // if (clickedOnEmpty) {

    //delete

    setIsDrawing(true);
    const stage = stageRef.getStage();
    console.log("getstage....", stage.getStage());
    const pointerPos = stage.getPointerPosition();
    console.log("pointerr>>>", pointerPos);

    const selectedBox = boundingBoxList.find((box) => {
      return (
        pointerPos.x >= box.x &&
        pointerPos.x <= box.x + box.width &&
        pointerPos.y >= box.y &&
        pointerPos.y <= box.y + box.height
      );
    });
    setSelectedBoxTemp(selectedBox);

    console.log("selected delete>>>>>", pointerPos, tempSelectedBox);
    if (
      tempSelectedBox &&
      pointerPos.x >= tempSelectedBox.x + tempSelectedBox.width + 10 &&
      pointerPos.x <= tempSelectedBox.x + tempSelectedBox.width + 10 + 30 &&
      pointerPos.y <= tempSelectedBox.y &&
      pointerPos.y >= tempSelectedBox.y - 30
    ) {
      console.log(
        "selected delete>>>>> conditions",
        pointerPos.x >= tempSelectedBox.x + tempSelectedBox.width + 10,
        pointerPos.x <= tempSelectedBox.x + tempSelectedBox.width + 10 + 30,
        pointerPos.y <= tempSelectedBox.y,
        pointerPos.y >= tempSelectedBox.y - 30
      );

      console.log("delete>>>");
      handleRemoveBox(tempSelectedBox.id);
      setSelectedBoxTemp(null);
      return;
    }

    console.log("sleectedBox>>>", selectedBox);

    if (selectedBox) {
      setSelectedId(selectedBox?.id);
    } else {
      const newBox = {
        id: `box-${boundingBoxList.length + 1}`,
        x: pointerPos.x,
        y: pointerPos.y,
        width: 0,
        height: 0,
      };
      setBoundingBoxList([...boundingBoxList, newBox]);
      setSelectedId(null);
    }

    // }
  };

  const handleMouseMove = () => {
    if (!isDrawing) {
      return;
    }
    const stage = stageRef.getStage();
    const pointerPos = stage.getPointerPosition();
    console.log("selectedId...", selectedId);
    if (selectedId) {
      const updatedBoxes = boundingBoxList.map((box) => {
        if (box.id === selectedId) {
          // Resize the selected box
          const newWidth = pointerPos.x - box.x;
          const newHeight = pointerPos.y - box.y;
          return { ...box, width: newWidth, height: newHeight };
        }
        return box;
      });
      setBoundingBoxList(updatedBoxes);
    } else {
      let tempBoxList = [...boundingBoxList];

      const updatedBox = { ...tempBoxList[tempBoxList.length - 1] };
      updatedBox.width = pointerPos.x - updatedBox.x;
      updatedBox.height = pointerPos.y - updatedBox.y;
      tempBoxList[tempBoxList.length - 1] = updatedBox;
      setBoundingBoxList(tempBoxList);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };
  const [image2] = useImage(process.env.REACT_APP_CROSS_IMAGE_URL);

  console.log("boxes>>>", boundingBoxList);

  const Rectangle = ({
    shapeProps,
    isSelected,
    onSelect,
    onChange,
    stroke,
    strokeWidth,
  }) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();

    console.log("image corsss", image, process.env.REACT_APP_CROSS_IMAGE_URL);

    React.useEffect(() => {
      if (isSelected) {
        // we need to attach transformer manually
        trRef.current.nodes([shapeRef.current]);
        trRef.current.getLayer().batchDraw();
      }
    }, [isSelected]);

    return (
      <React.Fragment>
        <Rect
          onClick={onSelect}
          onTap={onSelect}
          ref={shapeRef}
          {...shapeProps}
          stroke={stroke}
          strokeWidth={strokeWidth}
          draggable
          onDragEnd={(e) => {
            onChange({
              ...shapeProps,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={(e) => {
            // transformer is changing scale of the node
            // and NOT its width or height
            // but in the store we have only width and height
            // to match the data better we will reset scale on transform end
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            // we will reset it back
            node.scaleX(1);
            node.scaleY(1);
            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              // set minimal value
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(node.height() * scaleY),
            });
          }}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            boundBoxFunc={(oldBox, newBox) => {
              // limit resize
              if (newBox.width < 5 || newBox.height < 5) {
                return oldBox;
              }
              return newBox;
            }}
          />
        )}
        {isSelected && (
          <Image
            image={image2}
            x={shapeProps.x + shapeProps.width + 10}
            y={shapeProps.y - 30}
            width={30}
            height={30}
            onMouseEnter={(e) => {
              // style stage container:
              const container = e.target.getStage().container();
              container.style.cursor = "pointer";
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage().container();
              container.style.cursor = "default";
            }}
            onClick={(e) => {
              const container = e.target.getStage().container();
              container.style.cursor = "default";
              handleRemoveBox(shapeProps.id);
            }}
          />
        )}
      </React.Fragment>
    );
  };

  console.log("boxes.>", boundingBoxList);

  return (
    <div>
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        onMouseDown={() => handleMouseDown(selectedBoxTemp)}
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
          {boundingBoxList &&
            boundingBoxList.map((box, index) => (
              <Rectangle
                key={index}
                shapeProps={box}
                isSelected={box.id === selectedId}
                onSelect={() => {
                  console.log("box>>>", box, "select clicked");
                  setSelectedId(box.id);
                }}
                onChange={(newAttrs) => {
                  const rects = [...boundingBoxList];
                  rects[index] = newAttrs;
                  setBoundingBoxList(rects);
                }}
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
