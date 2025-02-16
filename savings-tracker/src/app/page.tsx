"use client";

import React from "react";
import WelcomeSection from "../components/WelcomeSection";
import { SavingsHeader } from "../components/SavingsHeader/SavingsHeader";
import { InputSection } from "../components/InputSection";
import { ProgressSection } from "../components/ProgressSection";
import { GridSection } from "../components/GridSection";
import { ChatSection } from "../components/ChatSection";
import { CustomizationSection } from "../components/CustomizationSection";
import { DownloadButton } from "../components/DownloadButton";
import { SavingsProvider } from "../context/SavingsContext";
import { CustomizationProvider } from "../context/CustomizationContext";
import styles from "./page.module.css";

export default function SavingsTracker() {
  return (
    <CustomizationProvider>
      <SavingsProvider>
        <div className={styles.savingsTrackerContainer}>
          <div className={styles.container}>
            <WelcomeSection />
            <SavingsHeader />
            <InputSection />
            <ProgressSection />
            <GridSection />
            <DownloadButton />
            <ChatSection />
            <CustomizationSection />
          </div>
        </div>
      </SavingsProvider>
    </CustomizationProvider>
  );
}
