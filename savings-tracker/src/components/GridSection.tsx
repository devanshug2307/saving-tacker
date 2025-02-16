"use client";

import { useSavings } from "@/context/SavingsContext";
import { useCustomization } from "@/context/CustomizationContext";
import styles from "./GridSection.module.css";
import classNames from "classnames";
import { memo } from "react";
import type { GridCell } from "@/types/savings";

interface GridCellProps {
  cell: GridCell;
  index: number;
  currentShape: string;
  gridColors: {
    saved: string;
    unsaved: string;
  };
  updateGridCell: (index: number) => void;
}

const GridCellComponent = memo(
  ({
    cell,
    index,
    currentShape,
    gridColors,
    updateGridCell,
  }: GridCellProps) => (
    <button
      className={classNames(styles.gridCell, {
        [styles.saved]: cell.saved,
        [styles.circle]: currentShape === "circle",
        [styles.envelope]: currentShape === "envelope",
        [styles.star]: currentShape === "star",
        [styles.heart]: currentShape === "heart",
      })}
      onClick={() => updateGridCell(index)}
      style={{
        backgroundColor: cell.saved ? gridColors.saved : gridColors.unsaved,
        borderColor: cell.saved ? gridColors.saved : gridColors.unsaved,
      }}
      data-tooltip={
        cell.saved
          ? `Click to unmark ${cell.amount}`
          : `Click to mark ${cell.amount} as saved`
      }
    >
      ${cell.amount}
      <span className={styles.dayNumber}>Day {cell.day}</span>
    </button>
  )
);

GridCellComponent.displayName = "GridCellComponent";

export function GridSection() {
  const { gridCells, updateGridCell } = useSavings();
  const { currentShape, gridColors } = useCustomization();

  if (gridCells.length === 0) return null;

  return (
    <div className={styles.grid}>
      {gridCells.map((cell, index) => (
        <GridCellComponent
          key={`${index}-${currentShape}-${cell.saved}`}
          cell={cell}
          index={index}
          currentShape={currentShape}
          gridColors={gridColors}
          updateGridCell={updateGridCell}
        />
      ))}
    </div>
  );
}
