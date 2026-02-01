// components/ChartSection.tsx
import React, { useState, useEffect } from 'react';
import { Select, Typography } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { CaretDownFilled } from '@ant-design/icons';
import { getChartData } from './ChartSection.logic';
import './style.css';

const { Option } = Select;
const ChartSection: React.FC = () => {
  // State lưu trữ dữ liệu biểu đồ sau khi fetch từ API
  const [data, setData] = useState<any>([]);
  // State quản lý lựa chọn hiển thị: "0" - Ngày, "1" - Tuần, "2" - Tháng
  const [optionSelected, setOptionSelected] = useState("2");
  // State hiển thị tiêu đề thời gian hiện tại (Ví dụ: Tháng 1/2026)
  const [headerChart, setHeaderChart] = useState('Tháng 1/2026')

  useEffect(() => {
    // Mỗi khi optionSelected (Ngày/Tuần/Tháng) thay đổi, useEffect sẽ chạy lại để lấy dữ liệu mới
    async function getData() {
      // Gọi hàm logic để fetch dữ liệu dựa trên tùy chọn đã chọn
      let tempData = await getChartData(optionSelected);
      setData(tempData);
    }
    getData();
  }, [optionSelected])

  return (
    <div style={{ padding: '16px', width: '100%', backgroundColor: '#fff', borderRadius: '8px' }}>
      {/* PHẦN HEADER CỦA BIỂU ĐỒ: Tiêu đề và Bộ lọc */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <Typography.Title level={5} style={{ margin: 0 }}>Bảng thống kê theo ngày</Typography.Title>
          <Typography.Text type="secondary">{headerChart}</Typography.Text>
        </div>

        {/* BỘ LỌC THỜI GIAN: Cho phép chuyển đổi giữa các khung nhìn thời gian cụ thể */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 600, color: '#2B2B36', fontSize: '14px' }}>Xem theo</span>
          <Select
            defaultValue="2"
            style={{ width: 106 }}
            onChange={(value) => setOptionSelected(value)}
            suffixIcon={<CaretDownFilled style={{ color: '#FF7506', fontSize: '12px' }} />}
            className="chart-selector"
          >
            <Option value="0">Ngày</Option>
            <Option value="1">Tuần</Option>
            <Option value="2">Tháng</Option>
          </Select>
        </div>
      </div>

      {/* PHẦN BIỂU ĐỒ CHÍNH: Sử dụng thư viện Recharts */}
      <ResponsiveContainer width="100%" height={400}>
        {/* AreaChart: Biểu đồ vùng (có tô màu bên dưới đường line) */}
        <AreaChart data={data}>
          <defs>
            {/* Định nghĩa dải màu Gradient cho vùng bên dưới đường line (tạo hiệu ứng hiện đại) */}
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#4A90E2" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Lưới tọa độ bên dưới biểu đồ */}
          <CartesianGrid strokeDasharray="3 3" />

          {/* Trục X: Hiển thị thời gian (Ngày/Tuần/Tháng) */}
          <XAxis dataKey="name" />

          {/* Trục Y: Hiển thị giá trị số lượng */}
          <YAxis />

          {/* Tooltip: Hiển thị thông tin chi tiết khi di chuột vào các điểm dữ liệu */}
          <Tooltip
            contentStyle={{ borderRadius: '8px', backgroundColor: '#4A90E2', color: '#fff' }}
            formatter={(value: number) => value.toLocaleString()}
          />

          {/* Area: Vẽ vùng không gian có đổ màu Gradient id="colorUv" */}
          <Area type="monotone" dataKey="value" stroke="#4A90E2" fillOpacity={1} fill="url(#colorUv)" />

          {/* Line: Vẽ đường kẻ chính nối các điểm dữ liệu */}
          <Line type="monotone" dataKey="value" stroke="#be0eceff" strokeWidth={6} dot={{ stroke: '#4A90E2', strokeWidth: 5, r: 12 }} activeDot={{ r: 15 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartSection;
