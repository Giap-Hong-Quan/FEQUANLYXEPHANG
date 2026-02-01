// components/RightSidebar/RightSidebar.tsx
import React, { useEffect, useState } from "react";
import { Avatar, Calendar } from "antd";
import SummaryItem from "../summaryItem";
import { LaptopOutlined, SettingOutlined, FileTextOutlined, BellOutlined } from "@ant-design/icons";
import "./RightSidebar.css";
import { getSummaryData } from "./RightSidebar.logic";
const RightSidebar: React.FC = () => {
  const [summaryData, setSummaryData] = useState<any>([]);
  useEffect(() => {
    async function getData() {
      let summaryTemp = await getSummaryData();
      console.log(summaryTemp);
      if (summaryTemp.length == 3) {
        setSummaryData([{
          key: 1, title: "Thiết bị",
          percentage: summaryTemp[0].total ? Math.ceil((summaryTemp[0].active || 0) * 100 / summaryTemp[0].total) : 0,
          value: summaryTemp[0].total || 0, icon: <LaptopOutlined />, color: "#FF9138",
          active: summaryTemp[0].active || 0, inactive: (summaryTemp[0].total || 0) - (summaryTemp[0].active || 0)
        }, {
          key: 2, title: "Dịch vụ",
          percentage: summaryTemp[1].total ? Math.ceil((summaryTemp[1].active || 0) * 100 / summaryTemp[1].total) : 0,
          value: summaryTemp[1].total || 0,
          active: summaryTemp[1].active || 0, inactive: (summaryTemp[1].total || 0) - (summaryTemp[1].active || 0),
          icon: <SettingOutlined />,
          color: "#4277FF",
        }, {
          key: 3,
          percentage: summaryTemp[2].total ? Math.ceil((summaryTemp[2].active || 0) * 100 / summaryTemp[2].total) : 0,
          title: "Cấp số",
          value: summaryTemp[2].total || 0,
          active: summaryTemp[2].active || 0,
          inactive: (summaryTemp[2].total || 0) - (summaryTemp[2].active || 0),
          icon: <FileTextOutlined />,
          color: "#35C75A",
        },])
      }
    }
    getData();
  }, [])
  return (
    <div className="right-sidebar">
      <div className="user-info">
        <BellOutlined className="notification-icon" />
        <div className="user-profile-info">
          <Avatar
            src={localStorage.getItem('avatar') || "https://static.vecteezy.com/system/resources/thumbnails/043/900/708/small/user-profile-icon-illustration-vector.jpg"}
            size="large"
          />
          <div className="user">
            <p>Xin chào</p>
            <h3>{localStorage.getItem('userFullName')}</h3>
          </div>
        </div>
      </div>
      <h2>Tổng quan</h2>
      <div className="summary">
        {summaryData.map((item: any) => (
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
      <div className="summary">
        <Calendar fullscreen={false} />
      </div>
    </div>
  );
};

export default RightSidebar;
