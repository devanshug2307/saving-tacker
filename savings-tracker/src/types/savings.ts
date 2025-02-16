export interface SavingsGoal {
  totalAmount: number;
  numberOfDays: number;
  dailyAmount: number;
}

export interface GridCell {
  amount: number;
  day: number;
  saved: boolean;
} 