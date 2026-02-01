// components/RightSidebar/SummaryItem.tsx
import React, { useState } from "react";
import styles from "./SummaryItem.module.css";

interface SummaryItemProps {
  percentage: number;
  title: string;
  value: number;
  active: number;
  inactive: number;
  icon: React.ReactNode;
  color: string; // Color for title and progress bar
};
const SummaryItem = (props: SummaryItemProps) => {
  // Format number with dots (e.g., 4.221)
  const formatNumber = (num: number | undefined | null) => {
    if (num === undefined || num === null) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // SVG Calculations
  const radiusActive = 44;
  const radiusInactive = 36;
  const circumferenceActive = 2 * Math.PI * radiusActive;
  const circumferenceInactive = 2 * Math.PI * radiusInactive;

  const activeOffset = circumferenceActive - ((props.percentage || 0) / 100) * circumferenceActive;
  const inactivePercentage = props.value ? (props.inactive / props.value) * 100 : 0;
  const inactiveOffset = circumferenceInactive - (inactivePercentage / 100) * circumferenceInactive;

  return (
    <div className={styles.summaryItem}>
      {/* PHẦN 1: VÒNG TRÒN PHẦN TRĂM (SVG) */}
      <div className={styles.summaryItemLeft}>
        <svg viewBox="0 0 100 100" className={styles.svgCircle}>
          {/* Background Fill - Center */}
          <circle cx="50" cy="50" r={radiusActive} fill="#F6F6F6" />

          {/* Background Track - Outer */}
          <circle
            cx="50" cy="50" r={radiusActive}
            stroke="#EAEAEC" strokeWidth="4" fill="none"
          />
          {/* Background Track - Inner */}
          <circle
            cx="50" cy="50" r={radiusInactive}
            stroke="#EAEAEC" strokeWidth="4" fill="none"
          />
          {/* Inactive Arc (Dark Gray) */}
          <circle
            cx="50" cy="50" r={radiusInactive}
            stroke="#535261" strokeWidth="6" fill="none"
            strokeDasharray={circumferenceInactive}
            strokeDashoffset={inactiveOffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          {/* Active Arc (Primary Color) */}
          <circle
            cx="50" cy="50" r={radiusActive}
            stroke={props.color} strokeWidth="6" fill="none"
            strokeDasharray={circumferenceActive}
            strokeDashoffset={activeOffset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          {/* Center Text */}
          <text
            x="50" y="50" textAnchor="middle" dominantBaseline="middle"
            className={styles.percentageText}
          >
            {props.percentage}%
          </text>
        </svg>
      </div>

      {/* PHẦN 2: GIÁ TRỊ TỔNG VÀ TIÊU ĐỀ */}
      <div className={styles.summaryItemMiddle}>
        <h3 className={styles.totalValue}>{formatNumber(props.value)}</h3>
        <div className={styles.titleWithIcon} style={{ color: props.color }}>
          {props.icon}
          <span>{props.title}</span>
        </div>
      </div>

      {/* PHẦN 3: CHI TIẾT TRẠNG THÁI */}
      <div className={styles.summaryItemRight}>
        <div className={styles.detailRow}>
          <div className={styles.labelContainer}>
            <span className={styles.dot} style={{ backgroundColor: '#FFD130' }}></span>
            <span className={styles.labelText}>Đang hoạt động</span>
          </div>
          <strong style={{ color: props.color }}>{formatNumber(props.active)}</strong>
        </div>
        <div className={styles.detailRow}>
          <div className={styles.labelContainer}>
            <span className={styles.dot} style={{ backgroundColor: '#7E7D88' }}></span>
            <span className={styles.labelText}>Ngừng hoạt động</span>
          </div>
          <strong style={{ color: props.color }}>{formatNumber(props.inactive)}</strong>
        </div>
      </div>
    </div>
  )
}
export default SummaryItem;
