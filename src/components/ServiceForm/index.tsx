import React, { useEffect } from 'react';
import { Form, Input, Button, Row, Col, Checkbox, Select, Modal, message } from 'antd';
import './ServiceForm.css';

type ServiceFormProps = {
  handleSendStatus?: (status: boolean) => void;
  service?: any;
};

const ServiceForm: React.FC<ServiceFormProps> = ({ handleSendStatus, service }) => {
  const [form] = Form.useForm();
  const isEditMode = !!(service && (service.serviceCode || service.ServiceCode));

  const parseApiErrorMessage = async (response: Response) => {
    const text = await response.text();
    let errMsg = `Thao tác thất bại (${response.status})`;
    try {
      const err = JSON.parse(text);
      errMsg = err.message || err.title || err.Message || errMsg;
      if (err.errors && typeof err.errors === 'object') {
        const firstKey = Object.keys(err.errors)[0];
        if (firstKey && err.errors[firstKey]?.[0]) errMsg = err.errors[firstKey][0];
      }
    } catch {
      if (text) errMsg = text.length > 120 ? text.slice(0, 120) + '...' : text;
    }
    return errMsg;
  };

  const handleDelete = () => {
    const codeForUrl = service?.serviceCode || service?.ServiceCode;
    if (!codeForUrl) {
      message.error('Không tìm thấy mã dịch vụ để xóa');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận xóa dịch vụ',
      content: `Bạn có chắc muốn xóa dịch vụ "${codeForUrl}" không?`,
      okText: 'Xóa',
      okButtonProps: { danger: true },
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          const baseUrl = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '') + '/api/Service';
          const url = baseUrl + '/' + encodeURIComponent(codeForUrl);
          const response = await fetch(url, {
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            message.success('Xóa dịch vụ thành công!');
            handleSendStatus?.(false);
          } else {
            message.error(await parseApiErrorMessage(response));
          }
        } catch (error) {
          console.error(error);
          message.error('Có lỗi xảy ra khi xóa dịch vụ (mạng hoặc CORS)');
        }
      },
    });
  };

  useEffect(() => {
    if (!isEditMode || !service) {
      // Khi chuyển sang chế độ thêm mới, reset form về giá trị mặc định
      form.resetFields();
      return;
    }

    form.setFieldsValue({
      serviceCode: service.serviceCode || service.ServiceCode || '',
      serviceName: service.serviceName || service.ServiceName || '',
      description: service.description || service.Description || '',
      isInOperation:
        service.isInOperation === 'Active' ||
        service.isInOperation === true ||
        service.IsInOperation === true,
    });
  }, [isEditMode, service, form]);

  const handleFinish = async (values: any) => {
    const payload: any = {
      ServiceCode: values.serviceCode?.trim() || '',
      ServiceName: values.serviceName?.trim() || '',
      Description: values.description?.trim() || '',
      IsInOperation: values.isInOperation !== false,
    };

    // Khi thêm mới thì gửi kèm Quy tắc cấp số.
    // Khi cập nhật chỉ sửa thông tin cơ bản, để backend giữ nguyên rule cũ.
    if (!isEditMode) {
      payload.NumberRule = {
        AutoIncrement: values.autoIncrement ?? true,
        StartNumber: Number(values.startNumber) || 1,
        EndNumber: Number(values.endNumber) || 9999,
        Prefix: values.prefix?.trim() || null,
        Suffix: values.suffix?.trim() ? values.suffix.trim() : null,
        ResetDaily: values.resetDaily ?? true,
      };
    }

    try {
      const token = localStorage.getItem('token');
      const baseUrl = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '') + '/api/Service';
      let url = baseUrl;
      let method: 'POST' | 'PUT' = 'POST';

      if (isEditMode) {
        const codeForUrl =
          service?.serviceCode ||
          service?.ServiceCode ||
          values.serviceCode?.trim() ||
          '';
        if (codeForUrl) {
          url = baseUrl + '/' + encodeURIComponent(codeForUrl);
          method = 'PUT';
        }
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        message.success(isEditMode ? 'Cập nhật dịch vụ thành công!' : 'Thêm dịch vụ thành công!');
        form.resetFields();
        handleSendStatus?.(false);
      } else {
        const text = await response.text();
        let errMsg = `Thêm dịch vụ thất bại (${response.status})`;
        try {
          const err = JSON.parse(text);
          errMsg = err.message || err.title || err.Message || errMsg;
          if (err.errors && typeof err.errors === 'object') {
            const firstKey = Object.keys(err.errors)[0];
            if (firstKey && err.errors[firstKey]?.[0]) errMsg = err.errors[firstKey][0];
          }
        } catch {
          if (text) errMsg = text.length > 120 ? text.slice(0, 120) + '...' : text;
        }
        message.error(errMsg);
      }
    } catch (error) {
      console.error(error);
      message.error('Có lỗi xảy ra khi thêm dịch vụ (mạng hoặc CORS)');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    handleSendStatus?.(false);
  };

  return (
    <div className="service-form-container">
      <h2 className="service-form-title">Quản lý dịch vụ</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="service-form"
        initialValues={{
          isInOperation: true,
          autoIncrement: true,
          startNumber: 1,
          endNumber: 9999,
          prefix: '',
          suffix: '',
          resetDaily: true,
        }}
      >
        <Row gutter={24}>
          <Col xs={24} lg={12}>
            <Form.Item
              name="serviceCode"
              label="Mã dịch vụ"
              rules={[{ required: true, message: 'Mã dịch vụ là bắt buộc' }]}
            >
              <Input placeholder="Nhập mã dịch vụ" />
            </Form.Item>
            <Form.Item
              name="serviceName"
              label="Tên dịch vụ"
              rules={[{ required: true, message: 'Tên dịch vụ là bắt buộc' }]}
            >
              <Input placeholder="Nhập tên dịch vụ" />
            </Form.Item>
            <Form.Item
              name="isInOperation"
              label="Trạng thái hoạt động"
              rules={[{ required: true, message: 'Chọn trạng thái hoạt động' }]}
            >
              <Select
                placeholder="Chọn trạng thái"
                options={[
                  { value: true, label: 'Hoạt động' },
                  { value: false, label: 'Ngừng hoạt động' },
                ]}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea placeholder="Mô tả dịch vụ" rows={4} />
            </Form.Item>
          </Col>
        </Row>
        {!isEditMode && (
          <div className="rules-section">
            <h3 className="rules-section-title">Quy tắc cấp số</h3>
            <p className="rules-section-desc">
              Cấu hình cách tạo số thứ tự cho phiếu (ví dụ: K0001, K0002...)
            </p>

            <div className="rules-block">
              <div className="rules-row rules-row-range">
                <span className="rules-label">Khoảng số</span>
                <div className="rules-range-inputs">
                  <Form.Item name="startNumber" noStyle>
                    <Input type="number" min={1} placeholder="1" className="rules-input-num" />
                  </Form.Item>
                  <span className="rules-to">đến</span>
                  <Form.Item name="endNumber" noStyle>
                    <Input type="number" min={1} placeholder="9999" className="rules-input-num" />
                  </Form.Item>
                </div>
                <Form.Item name="autoIncrement" valuePropName="checked" noStyle>
                  <Checkbox className="rules-checkbox">Tăng tự động</Checkbox>
                </Form.Item>
              </div>

              <div className="rules-row rules-row-format">
                <Form.Item name="prefix" label="Tiền tố (đứng trước số)" className="rules-format-item">
                  <Input placeholder="VD: K → K0001, K0002" maxLength={10} />
                </Form.Item>
                <Form.Item name="suffix" label="Hậu tố (đứng sau số)" className="rules-format-item">
                  <Input placeholder="Để trống hoặc VD: -01 → 0001-01" maxLength={10} />
                </Form.Item>
              </div>

              <Form.Item name="resetDaily" valuePropName="checked" className="rules-reset-item">
                <Checkbox>Reset mỗi ngày (số thứ tự bắt đầu lại từ đầu mỗi ngày)</Checkbox>
              </Form.Item>
            </div>
          </div>
        )}
        <Form.Item>
          <div className="form-actions">
            {isEditMode && (
              <Button danger onClick={handleDelete}>
                Xóa dịch vụ
              </Button>
            )}
            <Button htmlType="button" onClick={handleCancel}>
              Hủy bỏ
            </Button>
            <Button type="primary" htmlType="submit">
              {isEditMode ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ServiceForm;
