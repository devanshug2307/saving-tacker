import { GridCell, SavingsGoal } from "@/types/savings";

export function calculateDailyAmount(total: number, days: number): number {
  return Math.ceil(total / days / 5) * 5; // Round to nearest $5
}

export function generateGrid(total: number, days: number): GridCell[] {
  // Round total amount to nearest multiple of 5
  const roundedTotal = Math.ceil(total / 5) * 5;

  // Calculate base daily amount (multiple of 5)
  const dailyAmount = Math.floor(roundedTotal / days / 5) * 5;
  const extraAmount = roundedTotal - dailyAmount * days;
  const extraDays = Math.ceil(extraAmount / 5);

  return Array.from({ length: days }, (_, index) => ({
    amount: index < extraDays ? dailyAmount + 5 : dailyAmount,
    day: index + 1,
    saved: false,
  }));
}

export function calculateProgress(cells: GridCell[]): number {
  if (cells.length === 0) return 0;

  const savedAmount = cells
    .filter((cell) => cell.saved)
    .reduce((sum, cell) => sum + cell.amount, 0);

  const totalAmount = cells.reduce((sum, cell) => sum + cell.amount, 0);

  return (savedAmount / totalAmount) * 100;
}

export function parseSavingsGoal(input: string): SavingsGoal | null {
  // Extract numbers from the saving goal using regex
  const amountMatch = input.match(
    /(?:save|goal|total)?\s*\$?\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i
  );
  const daysMatch = input.match(/(\d+)\s*days?/i);
  const maxDailyMatch = input.match(
    /max(?:imum)?\s*(?:\$\s*?|\s+)?(\d+)(?:\s*dollars?)?\s*(?:per\s*day|daily|a\s*day)/i
  );

  if (!amountMatch || !daysMatch) return null;

  const amount = parseFloat(amountMatch[1].replace(/,/g, ""));
  const days = parseInt(daysMatch[1]);
  const maxDailyAmount = maxDailyMatch
    ? parseFloat(maxDailyMatch[1].replace(/,/g, ""))
    : null;

  // Check if the goal is feasible with max daily amount
  const requiredDailyAmount = Math.ceil(amount / days);
  if (maxDailyAmount && requiredDailyAmount > maxDailyAmount) {
    return null;
  }

  return {
    totalAmount: amount,
    numberOfDays: days,
    dailyAmount: calculateDailyAmount(amount, days),
  };
}

export async function processGoalWithAI(
  input: string
): Promise<SavingsGoal | null> {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ savingGoal: input }),
    });

    if (!response.ok) {
      throw new Error("Failed to process goal with AI");
    }

    const data = await response.json();
    return {
      totalAmount: data.totalAmount,
      numberOfDays: data.numberOfDays,
      dailyAmount: calculateDailyAmount(data.totalAmount, data.numberOfDays),
    };
  } catch (error) {
    console.error("Error processing goal with AI:", error);
    return null;
  }
}
