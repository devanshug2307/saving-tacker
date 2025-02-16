"use client";

import { useSavings } from "@/context/SavingsContext";
import styles from "./ProgressSection.module.css";

export function ProgressSection() {
  const { progress, savingsGoal, gridCells } = useSavings();

  const totalSaved = gridCells
    .filter((cell) => cell.saved)
    .reduce((sum, cell) => sum + cell.amount, 0);

  const totalGoal = gridCells.reduce((sum, cell) => sum + cell.amount, 0);

  return (
    <div className={styles.progressSection}>
      <div className={styles.progressText}>
        {savingsGoal
          ? `Saved: $${totalSaved.toLocaleString()} of $${totalGoal.toLocaleString()} (${Math.round(
              progress
            )}%)`
          : "Your savings progress"}
      </div>
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
