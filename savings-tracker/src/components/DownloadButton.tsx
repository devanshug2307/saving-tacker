"use client";

import { useSavings } from "@/context/SavingsContext";
import styles from "./DownloadButton.module.css";

declare global {
  interface Window {
    jspdf: any;
  }
}

export function DownloadButton() {
  const { savingsGoal, gridCells, progress } = useSavings();

  const downloadPDF = () => {
    if (!savingsGoal) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // PDF dimensions
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const usableWidth = pageWidth - 2 * margin;

    // Add a soft pink background
    doc.setFillColor(255, 245, 247);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Add decorative header
    doc.setFillColor(255, 77, 141);
    doc.roundedRect(margin, margin, usableWidth, 25, 5, 5, "F");

    // Add title
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Savings Tracker", pageWidth / 2, margin + 17, {
      align: "center",
    });

    // Add saving goal details with decorative box
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, margin + 35, usableWidth, 40, 3, 3, "F");
    doc.setFontSize(18);
    doc.setTextColor(255, 77, 141);
    doc.text("My Savings Goal", pageWidth / 2, margin + 45, {
      align: "center",
    });

    // Add goal details
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(
      `Save $${savingsGoal.dailyAmount} per day for ${savingsGoal.numberOfDays} days`,
      pageWidth / 2,
      margin + 53,
      { align: "center" }
    );

    const savedAmount = gridCells
      .filter((cell) => cell.saved)
      .reduce((sum, cell) => sum + cell.amount, 0);

    doc.text(
      `Saved: $${savedAmount.toLocaleString()} of $${savingsGoal.totalAmount.toLocaleString()} (${Math.round(
        progress
      )}%)`,
      pageWidth / 2,
      margin + 61,
      { align: "center" }
    );

    // Grid section
    const cellsPerRow = 5;
    const totalRows = Math.ceil(gridCells.length / cellsPerRow);
    const cellWidth = (usableWidth - (cellsPerRow - 1) * 3) / cellsPerRow;
    const cellHeight = 12;
    const startX = margin;
    let startY = margin + 85;
    const padding = 3;
    const maxRowsPerPage = 15;
    let currentPage = 1;

    // Function to add page header
    function addPageHeader(pageNum: number) {
      if (pageNum > 1) {
        doc.addPage();
        // Add background
        doc.setFillColor(255, 245, 247);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
        startY = margin + 20;
      }

      // Add grid section title
      doc.setFillColor(255, 77, 141);
      doc.setTextColor(255, 255, 255);
      doc.roundedRect(margin, startY - 15, usableWidth, 12, 3, 3, "F");
      doc.setFontSize(12);
      doc.text(`Daily Savings Grid`, pageWidth / 2, startY - 6, {
        align: "center",
      });
    }

    // Add initial page header
    addPageHeader(1);

    // Draw grid cells
    gridCells.forEach((cell, index) => {
      const currentRow = Math.floor(index / cellsPerRow);
      const col = index % cellsPerRow;

      // Check if we need a new page
      if (currentRow > 0 && currentRow % maxRowsPerPage === 0) {
        currentPage++;
        addPageHeader(currentPage);
      }

      // Calculate position
      const adjustedRow = currentRow % maxRowsPerPage;
      const x = startX + col * (cellWidth + padding);
      const y = startY + adjustedRow * (cellHeight + padding);

      // Add cell background
      if (cell.saved) {
        doc.setFillColor(255, 77, 141);
      } else {
        doc.setFillColor(255, 255, 255);
      }
      doc.roundedRect(x, y, cellWidth, cellHeight, 2, 2, "F");

      // Add cell border
      doc.setDrawColor(255, 77, 141);
      doc.roundedRect(x, y, cellWidth, cellHeight, 2, 2, "D");

      // Add cell text
      doc.setFontSize(9);
      if (cell.saved) {
        doc.setTextColor(255, 255, 255);
      } else {
        doc.setTextColor(80, 80, 80);
      }
      doc.text(`$${cell.amount}`, x + cellWidth / 2, y + cellHeight / 2, {
        align: "center",
      });

      // Add day number
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(`Day ${cell.day}`, x + cellWidth / 2, y + cellHeight - 2, {
        align: "center",
      });
    });

    // Add progress tracking section on the last page
    const lastY =
      startY +
      Math.min(maxRowsPerPage, totalRows - (currentPage - 1) * maxRowsPerPage) *
        (cellHeight + padding) +
      10;

    // Add progress tracking box
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, lastY, usableWidth, 35, 3, 3, "F");

    // Add progress tracking title
    doc.setFontSize(12);
    doc.setTextColor(255, 77, 141);
    doc.text("Progress Tracking", pageWidth / 2, lastY + 12, {
      align: "center",
    });

    // Add date fields
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text("Start Date: _____________", margin + 30, lastY + 25);
    doc.text(
      "Target End Date: _____________",
      margin + usableWidth - 30,
      lastY + 25,
      { align: "right" }
    );

    // Add motivational message
    const messageY = lastY + 45;
    doc.setFillColor(255, 209, 220);
    doc.roundedRect(margin, messageY, usableWidth, 20, 3, 3, "F");
    doc.setTextColor(255, 77, 141);
    doc.setFontSize(10);
    doc.text(
      "You're on your way to achieving your savings goal!",
      pageWidth / 2,
      messageY + 8,
      { align: "center" }
    );
    doc.text("Keep up the great work! 💪", pageWidth / 2, messageY + 15, {
      align: "center",
    });

    // Add footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text(
      "Generated by Savings Tracker - Your Path to Financial Success",
      pageWidth / 2,
      pageHeight - 15,
      { align: "center" }
    );
    doc.text(new Date().toLocaleDateString(), pageWidth / 2, pageHeight - 10, {
      align: "center",
    });

    // Save the PDF
    doc.save("my-savings-plan.pdf");
  };

  if (!savingsGoal) return null;

  return (
    <div className={styles.buttonContainer}>
      <button onClick={downloadPDF} className={styles.downloadButton}>
        <i className="fas fa-download"></i> Download PDF
      </button>
    </div>
  );
}
