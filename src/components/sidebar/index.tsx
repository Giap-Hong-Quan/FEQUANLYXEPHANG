// components/Sidebar/Sidebar.tsx
import React, {useState, useContext, useEffect} from "react";
import { Button, Menu } from "antd";
import { HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import "./Sidebar.css";
import "./HoverMenu.css";
import { SignalRContext } from "../../helpers/SignalRProvider";
type SideBarProps = {
  sendSelectedIndex: (index:number) => void;
}
const Sidebar = (props: SideBarProps) => {
  const [isSubMenuVisible, setSubMenuVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState('0');
  const role = localStorage.getItem('userRole'); // Lấy role 1 lần duy nhất

  useEffect(() => {
    const menuIndex = localStorage.getItem('menuIndex');
    
    if (menuIndex) {
      setSelectedKey(menuIndex);
    } else {
      // TỐI ƯU: Nếu là Doctor, mặc định sáng đèn mục "Cấp số" (key 6)
      // Nếu là Admin/Staff, mặc định Dashboard (key 0)
      const defaultKey = role === 'Doctor' ? '6' : '0';
      setSelectedKey(defaultKey);
      localStorage.setItem('menuIndex', defaultKey);
      props.sendSelectedIndex(parseInt(defaultKey)); // Báo cho trang chính hiển thị đúng component
    }
  }, [role]);

  const handleMenuClick = (key: string, index: number) => {
    localStorage.setItem('menuIndex', key);
    setSelectedKey(key);
    props.sendSelectedIndex(index);
  };
// Hàm helper để render icon từ thư mục public
  const renderIcon = (fileName: string) => (
    <img 
      src={`/icon/${fileName}`} 
      alt={fileName} 
      style={{ width: '20px', height: '20px' }} 
    />
  );
  return (
    <div className="sidebar">
       <div className="sider-content">
        <div>
          <div className="sidebar_logo">

        <img src="./images/Logo.png" className="sidebar_imglogo" alt="imglogo" />
          </div>
      <Menu
        mode="vertical"
        theme="light"
        selectedKeys={[selectedKey]}
        className="sidebar-menu"
      >
       {/* Dashboard: Doctor KHÔNG thấy, các role khác THẤY */}
        {role !== 'Doctor' && (
         <Menu.Item key="0" icon={renderIcon('dashboard.svg')} onClick={() => handleMenuClick('0', 0)}>
            Dashboard
          </Menu.Item>
        )}
        {/* Thiết bị (Device): Staff và Doctor KHÔNG thấy, chỉ Admin (hoặc các role khác) THẤY */}
        {role !== 'Staff' && role !== 'Doctor' && (
          <Menu.Item key="1" icon={renderIcon('device.svg')} onClick={() => handleMenuClick('1', 1)}>
            Thiết bị
          </Menu.Item>
        )}
        {/* Dịch vụ: Doctor KHÔNG thấy, Staff vẫn thấy (để quản lý hàng đợi dịch vụ) */}
        {role !== 'Doctor' && (
          <Menu.Item key="5" icon={renderIcon('service.svg')} onClick={() => handleMenuClick('5', 5)}>
            Dịch vụ
          </Menu.Item>
        )}
        {/* Mục dành cho tất cả mọi người */}
        <Menu.Item key="6" icon={renderIcon('queue.svg')} onClick={() => handleMenuClick('6', 6)}>
          Cấp số
        </Menu.Item>
        {/* Cài đặt hệ thống (giữ nguyên logic hover của bạn) */}
        <div className="hover-container" onMouseOver={() => setSubMenuVisible(true)}>
          <Menu.Item key="7" icon={renderIcon('setting.svg')} className="menu-item">
            Cài đặt hệ thống
          </Menu.Item>
          {isSubMenuVisible && (
            <div className="submenu" onMouseOut={() => setSubMenuVisible(false)}>
              <Menu mode="vertical" className="submenu-content">
                <Menu.Item key="sub2" onClick={() => handleMenuClick('7', 7)}>Quản lý tài khoản</Menu.Item>
                <Menu.Item key="sub3">Nhật ký người dùng</Menu.Item>
              </Menu>
            </div>
          )}
        </div>

      </Menu>
        </div>
        <Button
            key="8" 
             icon={renderIcon('logout.svg')}
            className="logout-button"
            onClick={() => {
                localStorage.clear();
                window.location.reload();
            }}
        >
          Đăng xuất
        </Button>

       </div>
    </div>
  );
};

export default Sidebar;
