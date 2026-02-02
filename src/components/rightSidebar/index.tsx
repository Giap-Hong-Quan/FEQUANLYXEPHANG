import React, { useEffect, useState } from "react";
import { Avatar, Calendar, ConfigProvider } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import locale from "antd/es/locale/en_GB";
import {
  BellOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import SummaryItem from "../summaryItem";
import { getSummaryData } from "./RightSidebar.logic";
import "./RightSidebar.css";

// Định nghĩa kiểu dữ liệu để tránh dùng 'any'
interface SummaryDataType {
  key: number;
  title: string;
  percentage: number;
  value: number;
  active: number;
  inactive: number;
  icon: React.ReactNode;
  color: string;
}

const RightSidebar: React.FC = () => {
  const [summaryData, setSummaryData] = useState<SummaryDataType[]>([]);

  // Hàm helper để render icon từ thư mục public (giống Sidebar)
  const renderIcon = (fileName: string) => (
    <img
      src={`/icon/${fileName}`}
      alt={fileName}
      style={{ width: '20px', height: '20px' }}
    />
  );

  useEffect(() => {
    async function getData() {
      const summaryTemp = await getSummaryData();
      if (summaryTemp && summaryTemp.length === 3) {
        const configs = [
          { title: "Thiết bị", icon: renderIcon('icon_thietbi.png'), color: "#FF9138" },
          { title: "Dịch vụ", icon: renderIcon('icon_dichvu.png'), color: "#4277FF" },
          { title: "Cấp số", icon: renderIcon('icon_capso.png'), color: "#15df41ff" },
        ];

        const mappedData = summaryTemp.map((item: any, index: number) => ({
          key: index + 1,
          title: configs[index].title,
          percentage: item.total ? Math.ceil(((item.active || 0) * 100) / item.total) : 0,
          value: item.total || 0,
          active: item.active || 0,
          inactive: (item.total || 0) - (item.active || 0),
          icon: configs[index].icon,
          color: configs[index].color,
        }));
        setSummaryData(mappedData);
      }
    }
    getData();
  }, []);

  return (
    <ConfigProvider locale={locale}>
      <div className="right-sidebar">
        {/* User Info Section */}
        <div className="user-info">
          <div className="notification-wrapper">
            <BellOutlined className="notification-icon" />
            <span className="dot"></span>
          </div>
          <div className="user-profile-info">
            <Avatar
              src={localStorage.getItem("avatar") || "https://static.vecteezy.com/system/resources/thumbnails/043/900/708/small/user-profile-icon-illustration-vector.jpg"}
              size={40}
            />
            <div className="user">
              <p>Xin chào</p>
              <h3>{localStorage.getItem("userFullName") || "Người dùng"}</h3>
            </div>
          </div>
        </div>

        <h2 className="overview-title">Tổng quan</h2>

        {/* Summary List */}
        <div className="summary-list">
          {summaryData.map((item) => (
            <SummaryItem
              key={item.key}
              percentage={item.percentage}
              title={item.title}
              value={item.value}
              active={item.active}
              inactive={item.inactive}
              icon={item.icon}
              color={item.color}
            />
          ))}
        </div>

        {/* Calendar Section */}
        <div className="calendar-card">
          <Calendar
            fullscreen={false}
            headerRender={({ value, onChange }) => {
              return (
                <div className="custom-calendar-header">
                  <LeftOutlined
                    className="nav-arrow"
                    onClick={() => onChange(value.clone().subtract(1, "month"))}
                  />
                  <span className="header-date-text">
                    {value.format("DD MMM YYYY")}
                  </span>
                  <RightOutlined
                    className="nav-arrow"
                    onClick={() => onChange(value.clone().add(1, "month"))}
                  />
                </div>
              );
            }}
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default RightSidebar;