import { useState, useEffect, useCallback, useRef } from "react";

interface GridColors {
  saved: string;
  unsaved: string;
}

type Shape = "square" | "circle" | "envelope" | "star" | "heart";

export function useCustomization() {
  const [currentShape, setCurrentShape] = useState<Shape>("square");
  const [gridColors, setGridColors] = useState<GridColors>({
    saved: "#ff4d8d",
    unsaved: "#ffd1dc",
  });
  const forceUpdateRef = useRef(0);
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedShape = localStorage.getItem("savedShape") as Shape | null;
    const savedColors = localStorage.getItem("gridColors");

    if (savedShape) {
      setCurrentShape(savedShape);
    }
    if (savedColors) {
      try {
        const parsedColors = JSON.parse(savedColors);
        if (parsedColors.saved && parsedColors.unsaved) {
          setGridColors(parsedColors);
        }
      } catch (e) {
        console.error("Error parsing saved colors:", e);
      }
    }
  }, []);

  const updateShape = useCallback((shape: Shape) => {
    setCurrentShape(shape);
    localStorage.setItem("savedShape", shape);
    // Force immediate update
    forceUpdateRef.current += 1;
    setForceUpdate((prev) => prev + 1);
  }, []);

  const updateColors = useCallback(
    (type: "saved" | "unsaved", color: string) => {
      setGridColors((prev) => {
        const newColors = { ...prev, [type]: color };
        localStorage.setItem("gridColors", JSON.stringify(newColors));
        return newColors;
      });
      // Force immediate update
      forceUpdateRef.current += 1;
      setForceUpdate((prev) => prev + 1);
    },
    []
  );

  return {
    currentShape,
    gridColors,
    updateShape,
    updateColors,
    forceUpdate: forceUpdateRef.current,
  };
}
