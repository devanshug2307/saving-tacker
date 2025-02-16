"use client";

import { useState } from "react";
import { useCustomization } from "@/context/CustomizationContext";
import styles from "./CustomizationSection.module.css";
import classNames from "classnames";

type ColorType = "saved" | "unsaved";
type Shape = "square" | "circle" | "envelope" | "star" | "heart";

const predefinedColors = [
  "#ffd1dc",
  "#ff4d8d",
  "#4CAF50",
  "#2196F3",
  "#9C27B0",
  "#FF9800",
];

const shapes: { id: Shape; icon: string; label: string }[] = [
  { id: "square", icon: "fa-square", label: "Square" },
  { id: "circle", icon: "fa-circle", label: "Circle" },
  { id: "envelope", icon: "fa-envelope", label: "Envelope" },
  { id: "star", icon: "fa-star", label: "Star" },
  { id: "heart", icon: "fa-heart", label: "Heart" },
];

export function CustomizationSection() {
  const { gridColors, updateColors, currentShape, updateShape } =
    useCustomization();
  const [currentColorType, setCurrentColorType] =
    useState<ColorType>("unsaved");
  const [showColorPreview, setShowColorPreview] = useState(false);
  const [previewColor, setPreviewColor] = useState("");

  const handleColorSelect = (color: string) => {
    updateColors(currentColorType, color);
    showColorPreviewToast(color);
  };

  const showColorPreviewToast = (color: string) => {
    setPreviewColor(color);
    setShowColorPreview(true);
    setTimeout(() => setShowColorPreview(false), 2000);
  };

  return (
    <div className={styles.customizationContainer}>
      <div className={styles.colorPickerContainer}>
        <div className={styles.colorPickerTitle}>
          <i className="fas fa-paint-brush"></i>
          <h3>Customize Your Grid</h3>
          <div className={styles.colorPickerSubtitle}>
            Personalize the colors of your savings grid
          </div>
        </div>

        <div className={styles.colorTypeSwitch}>
          <button
            className={classNames(styles.colorTypeBtn, {
              [styles.active]: currentColorType === "unsaved",
            })}
            onClick={() => setCurrentColorType("unsaved")}
          >
            <i className="fas fa-square"></i> Unsaved Cells
          </button>
          <button
            className={classNames(styles.colorTypeBtn, {
              [styles.active]: currentColorType === "saved",
            })}
            onClick={() => setCurrentColorType("saved")}
          >
            <i className="fas fa-check-square"></i> Saved Cells
          </button>
        </div>

        <div className={styles.colorOptions}>
          {predefinedColors.map((color) => (
            <div
              key={color}
              className={classNames(styles.colorOption, {
                [styles.selected]: gridColors[currentColorType] === color,
              })}
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
            />
          ))}
        </div>

        <div className={styles.customColorInput}>
          <input
            type="color"
            value={gridColors[currentColorType]}
            onChange={(e) => handleColorSelect(e.target.value)}
          />
          <label>
            <i className="fas fa-paint-brush"></i> Custom Color
          </label>
        </div>
      </div>

      <div className={styles.shapePickerContainer}>
        <div className={styles.shapePickerTitle}>
          <i className="fas fa-shapes"></i>
          <h3>Choose Grid Shape</h3>
          <div className={styles.shapePickerSubtitle}>
            Select different shapes for your savings grid cells
          </div>
        </div>

        <div className={styles.shapeOptions}>
          {shapes.map((shape) => (
            <button
              key={shape.id}
              className={classNames(styles.shapeBtn, {
                [styles.active]: currentShape === shape.id,
              })}
              onClick={() => updateShape(shape.id)}
            >
              <i className={`fas ${shape.icon}`}></i>
              <span>{shape.label}</span>
            </button>
          ))}
        </div>
      </div>

      {showColorPreview && (
        <div className={styles.colorPreview}>
          <div
            className={styles.colorPreviewBox}
            style={{ backgroundColor: previewColor }}
          />
          <div className={styles.colorPreviewText}>
            Selected: {previewColor}
          </div>
        </div>
      )}
    </div>
  );
}
