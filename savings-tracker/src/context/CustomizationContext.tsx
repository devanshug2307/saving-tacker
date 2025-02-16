"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Shape = "square" | "circle" | "envelope" | "star" | "heart";

interface GridColors {
  saved: string;
  unsaved: string;
}

interface CustomizationContextType {
  currentShape: Shape;
  gridColors: GridColors;
  updateShape: (shape: Shape) => void;
  updateColors: (type: "saved" | "unsaved", color: string) => void;
}

const CustomizationContext = createContext<
  CustomizationContextType | undefined
>(undefined);

export function CustomizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentShape, setCurrentShape] = useState<Shape>("square");
  const [gridColors, setGridColors] = useState<GridColors>({
    saved: "#ff4d8d",
    unsaved: "#ffd1dc",
  });

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

  const updateShape = (shape: Shape) => {
    setCurrentShape(shape);
    localStorage.setItem("savedShape", shape);
  };

  const updateColors = (type: "saved" | "unsaved", color: string) => {
    setGridColors((prev) => {
      const newColors = { ...prev, [type]: color };
      localStorage.setItem("gridColors", JSON.stringify(newColors));
      return newColors;
    });
  };

  return (
    <CustomizationContext.Provider
      value={{
        currentShape,
        gridColors,
        updateShape,
        updateColors,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
}

export function useCustomization() {
  const context = useContext(CustomizationContext);
  if (context === undefined) {
    throw new Error(
      "useCustomization must be used within a CustomizationProvider"
    );
  }
  return context;
}
