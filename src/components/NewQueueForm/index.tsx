import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Input, message } from 'antd';
import './NewQueueForm.css';
import { getServiceData, getDeviceData } from '../../pages/dashboard/Dashboard.logic';

const { Option } = Select;

type NewQueueFormProps = {
  serviceOptions?: { value: string; label: string }[]; // optional
  isNumberDisplay: (status: boolean, data: any) => void;
};

const NewQueueForm: React.FC<NewQueueFormProps> = (props) => {
  const [form] = Form.useForm();

  const [serviceOptions, setServiceOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [deviceOptions, setDeviceOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // ================= SUBMIT =================
  const handleFinish = async (values: any) => {
    console.log('SEND VALUES:', values);

    const payload = {
      code: 'abc', // backend thường tự sinh → giữ cũng được
      customerName: values.customerName,
      telephone: values.telephone,
      status: 0,
      deviceCode: values.deviceCode,     // ✅ QUAN TRỌNG
      serviceCode: values.serviceCode,
      assignmentDate: new Date().toISOString(),
      expireDate: new Date().toISOString(),
    };

    console.log('PAYLOAD:', payload);

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + 'api/Assignment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error('API ERROR:', errText);
        message.error('Cấp số thất bại');
        return;
      }

      // ✅ FIX lỗi JSON rỗng
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      console.log('API RESPONSE:', data);

      message.success('Cấp số thành công');
      props.isNumberDisplay(true, data);
      form.resetFields();

    } catch (error) {
      console.error('FETCH ERROR:', error);
      message.error('Không kết nối được server');
    }
  };

  // ================= LOAD DATA =================
  useEffect(() => {
    async function loadData() {
      try {
        const services = await getServiceData();
        const devices = await getDeviceData();

        // ✅ CHỈ HIỂN THỊ CÁC DỊCH VỤ ĐANG HOẠT ĐỘNG
        setServiceOptions(
          services
            .filter((s: any) => 
              s.isInOperation === true || 
              s.IsInOperation === true || 
              s.isInOperation === 'Active'
            )
            .map((s: any) => ({
              value: s.serviceCode,
              label: s.serviceName,
            }))
        );

        setDeviceOptions(
          devices.map((d: any) => ({
            value: d.deviceCode,
            label: d.deviceName,
          }))
        );
      } catch (e) {
        console.error(e);
        message.error('Không tải được dữ liệu');
      }
    }

    loadData();
  }, []);

  // ================= RENDER =================
  return (
    <div className="new-queue-form-container">
      <h2 className="new-queue-form-title">CẤP SỐ MỚI</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="new-queue-form"
      >
        {/* DỊCH VỤ */}
        <Form.Item
          name="serviceCode"
          label="Dịch vụ"
          rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
        >
          <Select placeholder="Chọn dịch vụ">
            {serviceOptions.map((s) => (
              <Option key={s.value} value={s.value}>
                {s.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* THIẾT BỊ */}
        <Form.Item
          name="deviceCode"
          label="Nguồn cấp (Thiết bị)"
          rules={[{ required: true, message: 'Vui lòng chọn thiết bị' }]}
        >
          <Select placeholder="Chọn thiết bị">
            {deviceOptions.map((d) => (
              <Option key={d.value} value={d.value}>
                {d.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* TÊN KHÁCH HÀNG */}
        <Form.Item
          name="customerName"
          label="Tên khách hàng"
          rules={[{ required: true, message: 'Nhập tên khách hàng' }]}
        >
          <Input placeholder="Nhập tên khách hàng" />
        </Form.Item>

        {/* SĐT */}
        <Form.Item
          name="telephone"
          label="Số điện thoại"
          rules={[{ required: true, message: 'Nhập số điện thoại' }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block style={{ backgroundColor: '#FF7506', borderColor: '#FF7506' }}>
            In số
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NewQueueForm;
