"use client";

import { useState } from "react";
import { useSavings } from "@/context/SavingsContext";
import styles from "./ChatSection.module.css";

const examplePrompts = [
  "I want to save $1000 in 50 days",
  "Help me save $500 in 30 days with max $20 per day",
  "I need to save for a vacation",
];

export function ChatSection() {
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: `Hi! I'm your savings assistant 👋 I'm here to help you save money and achieve your financial goals! Try saying something like:`,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { setSavingsGoal } = useSavings();

  const clearChat = () => {
    setMessages([
      {
        type: "ai",
        text: `Hi! I'm your savings assistant 👋 I'm here to help you save money and achieve your financial goals! Try saying something like:`,
      },
    ]);
  };

  const useExample = (text: string) => {
    addMessage("user", text);
    processMessage(text);
  };

  const addMessage = (type: "user" | "ai", text: string) => {
    setMessages((prev) => [...prev, { type, text }]);
  };

  const processMessage = async (text: string) => {
    setIsTyping(true);
    try {
      // Process the message and update savings goal
      // This is a placeholder for the actual AI processing
      setTimeout(() => {
        const response = `Great! I'll help you achieve your savings goal. Let's make it happen! 💪`;
        addMessage("ai", response);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      addMessage(
        "ai",
        "Sorry, I had trouble processing your request. Please try again."
      );
      setIsTyping(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h3>
          <i className="fas fa-robot"></i> Your Savings Assistant
        </h3>
        <button
          onClick={clearChat}
          className={styles.clearChatBtn}
          data-tooltip="Clear conversation history"
        >
          <i className="fas fa-trash"></i> Clear Chat
        </button>
      </div>

      <div className={styles.chatMessages}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.chatMessage} ${
              message.type === "ai" ? styles.aiMessage : styles.userMessage
            }`}
          >
            {message.text}
            {index === 0 && (
              <div className={styles.examplePrompts}>
                {examplePrompts.map((prompt, i) => (
                  <div
                    key={i}
                    className={styles.examplePrompt}
                    onClick={() => useExample(prompt)}
                  >
                    {prompt}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {isTyping && (
        <div className={styles.typingIndicator}>
          <span>•</span>
          <span>•</span>
          <span>•</span>
        </div>
      )}
    </div>
  );
}
