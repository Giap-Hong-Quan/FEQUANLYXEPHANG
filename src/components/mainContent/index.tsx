// components/MainContent/MainContent.tsx
import React, { useState, useEffect } from "react";
import InfoCard from "../inforCard";
import { CalendarOutlined, CheckCircleOutlined, PhoneOutlined, BookOutlined } from "@ant-design/icons";
import "./MainContent.css";
import ChartSection from "../charts";
import { getSummaryData } from "./MainContent.logic";
interface CardData {
  icon: React.ReactNode;
  title: string;
  value: number;
  percentage: string;
  isPositive: boolean;
  color: string;
}

const MainContent: React.FC = () => {
  const token = localStorage.getItem('token') ?? '';
  const [cardsData, setCardsData] = useState<CardData[]>([
    {
      icon: <CalendarOutlined style={{ fontSize: '20px' }} />,
      title: "Số thứ tự đã cấp",
      value: 4221,
      percentage: "32.41%",
      isPositive: true,
      color: "#6695FF",
    },
    {
      icon: <CheckCircleOutlined style={{ fontSize: '20px' }} />,
      title: "Số thứ tự đã sử dụng",
      value: 3721,
      percentage: "32.41%",
      isPositive: false,
      color: "#35C75A",
    },
    {
      icon: <PhoneOutlined style={{ fontSize: '20px' }} />,
      title: "Số thứ tự đang chờ",
      value: 468,
      percentage: "56.41%",
      isPositive: true,
      color: "#FFAC6A",
    },
    {
      icon: <BookOutlined style={{ fontSize: '20px' }} />,
      title: "Số thứ tự đã bỏ qua",
      value: 32,
      percentage: "22.41%",
      isPositive: false,
      color: "#F86D6D",
    },
  ]);
  useEffect(() => {
    async function getStatistic() {
      let temp = await getSummaryData(token);
      if (temp) {
        setCardsData([
          {
            icon: <CalendarOutlined style={{ fontSize: '20px' }} />,
            title: "Số thứ tự đã cấp",
            value: temp.total,
            percentage: "32.41%",
            isPositive: true,
            color: "#6695FF",
          },
          {
            icon: <CheckCircleOutlined style={{ fontSize: '20px' }} />,
            title: "Số thứ tự đã sử dụng",
            value: temp.connected,
            percentage: "32.41%",
            isPositive: false,
            color: "#35C75A",
          },
          {
            icon: <PhoneOutlined style={{ fontSize: '20px' }} />,
            title: "Số thứ tự đang chờ",
            value: temp.active,
            percentage: "56.41%",
            isPositive: true,
            color: "#FFAC6A",
          },
          {
            icon: <BookOutlined style={{ fontSize: '20px' }} />,
            title: "Số thứ tự đã bỏ qua",
            value: temp.total - temp.active - temp.connected,
            percentage: "22.41%",
            isPositive: false,
            color: "#F86D6D",
          },
        ]);
      }
    }
    getStatistic();
  }, [token]);

  return (
    <div className="main-content">
      <h3 className="dashboard-breadcrumb">Dashboard</h3>
      <h2>Biểu đồ cấp số</h2>
      <div className="info-cards">
        {cardsData.map((card, index) => (
          <InfoCard
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
            percentage={card.percentage}
            isPositive={card.isPositive}
            color={card.color}
          />
        ))}
      </div>
      <div className="info-cards">
        <ChartSection />
      </div>
    </div>
  );
};

export default MainContent;
