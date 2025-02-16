'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { SavingsGoal, GridCell } from '@/types/savings';
import { generateGrid, calculateProgress } from '@/utils/savings';

interface SavingsContextType {
  savingsGoal: SavingsGoal | null;
  setSavingsGoal: (goal: SavingsGoal) => void;
  gridCells: GridCell[];
  updateGridCell: (index: number) => void;
  progress: number;
  clearSavings: () => void;
}

const SavingsContext = createContext<SavingsContextType | undefined>(undefined);

export function SavingsProvider({ children }: { children: React.ReactNode }) {
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal | null>(null);
  const [gridCells, setGridCells] = useState<GridCell[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (savingsGoal) {
      const newGrid = generateGrid(savingsGoal.totalAmount, savingsGoal.numberOfDays);
      setGridCells(newGrid);
      setProgress(calculateProgress(newGrid));
    }
  }, [savingsGoal]);

  const updateGridCell = (index: number) => {
    const newCells = [...gridCells];
    newCells[index] = { ...newCells[index], saved: !newCells[index].saved };
    setGridCells(newCells);
    setProgress(calculateProgress(newCells));
    
    // Save to localStorage
    localStorage.setItem('savingsTrackerState', JSON.stringify({
      savingsGoal,
      gridCells: newCells,
      progress: calculateProgress(newCells)
    }));
  };

  const clearSavings = () => {
    setSavingsGoal(null);
    setGridCells([]);
    setProgress(0);
    localStorage.removeItem('savingsTrackerState');
  };

  // Load saved state on mount
  useEffect(() => {
    const savedState = localStorage.getItem('savingsTrackerState');
    if (savedState) {
      const { savingsGoal, gridCells, progress } = JSON.parse(savedState);
      setSavingsGoal(savingsGoal);
      setGridCells(gridCells);
      setProgress(progress);
    }
  }, []);

  return (
    <SavingsContext.Provider value={{
      savingsGoal,
      setSavingsGoal,
      gridCells,
      updateGridCell,
      progress,
      clearSavings
    }}>
      {children}
    </SavingsContext.Provider>
  );
}

export function useSavings() {
  const context = useContext(SavingsContext);
  if (context === undefined) {
    throw new Error('useSavings must be used within a SavingsProvider');
  }
  return context;
} 