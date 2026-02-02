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
  const [headerChart, setHeaderChart] = useState('Tháng 2/2026')

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '-18px' }}>
          <span style={{ fontWeight: 600, color: '#2B2B36', fontSize: '16px', lineHeight: '24px', }}>Xem theo</span>
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

          {/* Label unit */}
          <text x={30} y={385} dy={10} style={{ fontSize: '14px', fill: '#666' }}>
            sl / {optionSelected === "1" ? "tuần" : optionSelected === "2" ? "tháng" : "ngày"}
          </text>

          {/* Tooltip: Hiển thị thông tin chi tiết khi di chuột vào các điểm dữ liệu */}
          <Tooltip
            cursor={false}
            offset={-10} // Điều chỉnh offset để tooltip nằm sát điểm hơn
            content={({ active, payload, coordinate }) => {
              if (active && payload && payload.length) {
                return (
                  <div style={{
                    backgroundColor: '#5185F7',
                    padding: '5px 15px',
                    borderRadius: '8px',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '16px',
                    position: 'absolute', // Sử dụng absolute để thoát khỏi flow mặc định
                    left: coordinate?.x, // Lấy toạ độ X của điểm
                    top: coordinate?.y,  // Lấy toạ độ Y của điểm
                    transform: 'translate(-50%, -150%)', // Dịch chuyển để căn giữa và nằm phía trên
                    textAlign: 'center',
                    minWidth: '60px',
                    pointerEvents: 'none', // Tránh chuột che mất điểm
                    zIndex: 100, // Đảm bảo nổi lên trên
                    boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
                  }}>
                    {payload[0].value?.toLocaleString()}
                    <div style={{
                      position: 'absolute',
                      bottom: '-6px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: '6px solid #5185F7'
                    }} />
                  </div>
                );
              }
              return null;
            }}
          />

          {/* Area: Vẽ vùng không gian có đổ màu Gradient id="colorUv" */}
          <Area type="monotone" dataKey="value" stroke="#4A90E2" fillOpacity={1} fill="url(#colorUv)" />

          {/* Line: Vẽ đường kẻ chính nối các điểm dữ liệu */}
          <Line type="monotone" dataKey="value" stroke="#be0eceff" strokeWidth={6} dot={{ stroke: '#4A90E2', strokeWidth: 7, r: 6 }} activeDot={{ r: 18 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartSection;
