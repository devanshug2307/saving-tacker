"use client";

import { useState } from "react";
import { useSavings } from "@/context/SavingsContext";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { parseSavingsGoal, processGoalWithAI } from "@/utils/savings";
import styles from "./InputSection.module.css";

export function InputSection() {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const { setSavingsGoal } = useSavings();
  const { isListening, startListening, stopListening } = useVoiceRecognition(
    (text) => {
      setInput(text);
      handleInput(text);
    }
  );

  const handleInput = async (text: string) => {
    // First try parsing the input directly
    const goal = parseSavingsGoal(text);

    if (goal) {
      setMessage(
        `Save $${goal.dailyAmount} per day for ${
          goal.numberOfDays
        } days to reach $${goal.totalAmount.toLocaleString()}`
      );
      setSavingsGoal(goal);
      setInput("");
      return;
    }

    // If direct parsing fails, try using AI
    try {
      const aiGoal = await processGoalWithAI(text);
      if (aiGoal) {
        setMessage(
          `Save $${aiGoal.dailyAmount} per day for ${
            aiGoal.numberOfDays
          } days to reach $${aiGoal.totalAmount.toLocaleString()}`
        );
        setSavingsGoal(aiGoal);
        setInput("");
      } else {
        setMessage(
          "I couldn't understand your goal. Please try again with a specific amount and number of days."
        );
      }
    } catch (error) {
      console.error("Error processing goal:", error);
      setMessage(
        "Sorry, I couldn't process your goal at the moment. Please try again."
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInput(input);
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tell me your saving goal... (e.g., 'I want to save $1000 in 50 days')"
        />
        <button
          className={`${styles.voiceBtn} ${
            isListening ? styles.listening : ""
          }`}
          onClick={toggleVoiceInput}
        >
          <i className="fas fa-microphone"></i>
        </button>
      </div>
      {message && <div className={styles.message}>{message}</div>}
    </>
  );
}
