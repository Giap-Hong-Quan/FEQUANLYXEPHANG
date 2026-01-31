// components/DeviceList.tsx
import React, { useEffect, useState, useContext } from "react";
import { Table, Select, Input, Modal, Tag, Switch, message } from "antd";
import _ from 'lodash';
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import "./DeviceList.css";
import AddDeviceButton from "../AddDeviceButton";
import UserSection from "../userSection";
import NewQueueForm from "../NewQueueForm";
import { formatDate } from '../../pages/dashboard/Dashboard.logic';
import { getProvidedNumber, getTotalNumber } from "../../pages/dashboard/Dashboard.logic";
import AccountForm from "../AccountForm";
import DeviceForm from "../DeviceForm";
import { UserStatus, DeviceStatus, DeviceConnected, UserRole, NumberStatus } from "../../helpers/predefinedData";
import ServiceForm from "../ServiceForm";
import { SignalRContext } from "../../helpers/SignalRProvider";
import TicketDisplay from "../TicketDisplay/TicketDisplay";
import { useAppDispatch, useAppSelector } from "../../libraries/hook";
import { RootState } from "../../store/store";
import { userSlice } from "../../store/userReducers";
const { Option } = Select;
type DeviceListProps = {
  sendSelectedIndex: (index: number, data: any) => void;
  columns: number;
  headerText: string;
  buttonText: string;
  filter1: string;
  data: any[];
  rowCount?: number;
  filter2: string;
}
const initialValues = {
  fullName: "", // Pre-fill the username field
  email: "", // Pre-fill the email field
  phoneNumber: "",
}
const DeviceList = React.memo((props: DeviceListProps) => {
  const connection = useContext(SignalRContext);
  const [deletedEmail, setDeletedEmail] = useState('');
  const [isModelDeleteOpen, setIsModelDeleteOpen] = useState(false);
  const token = localStorage.getItem('token');
  const [requiredRender, setRequireRedender] = useState(false);
  const [filter1Value, setFilter1Value] = useState('All');
  const [filter2Value, setFilter2Value] = useState('All');
  const [status, setStatus] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [internalData, setInternalData] = useState<any>([]);
  const [displayData, setDisplayData] = useState<any>([]);
  const [serviceOptions, setServiceOptions] = useState<{ value: string, label: string }[]>([])
  const [internalColumns, setInternalColumns] = useState<any>([]);
  const [dataUserEdit, setDataUserEdit] = useState<any>({});
  const [isModelNumberOpen, setIsModalNumberOpen] = useState(false);
  const [newNumber, setNewNumber] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [assignmentDate, setAssignmentDate] = useState<string>('');
  const [serviceName, setServiceName] = useState<string>('');
  const storeData = useAppSelector((state: RootState) => state.user.items);
  const [data, setData] = useState(props.data);
  const [rowCount, setRowCount] = useState(props.rowCount ?? 1);
  const dispatch = useAppDispatch();
  const receiveStatus = (status: boolean) => {
    setIsModalOpen(status);
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const customPagination = {
    current: currentPage,
    pageSize: pageSize,
    total: rowCount,
    showSizeChanger: true,
    pageSizeOptions: ['10', '5', '2'], // Optional: Page size options
    onChange: async (page: number) => {
      setLoading(true);
      setCurrentPage(page);
      let temp = await getProvidedNumber("All", "2000-01-01", "2050-12-12", "All", "___", page, 5, "-1");
      setData(temp);
      setLoading(false);
    },
    onShowSizeChange: async (current: number, newSize: number) => {
      setPageSize(newSize);
      setCurrentPage(current)
    },
  };

  const receiveIsNumberDisplay = (status: boolean, data: any) => {
    if (status) {
      setCustomerName(data.customerName);
      setNewNumber(data.code);
      setServiceName(data.serviceName);
      setAssignmentDate(formatDate(data.assignmentDate));
      setIsModalOpen(false);
      setIsModalNumberOpen(true);
    }
  }
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setDataUserEdit({});
    setIsModalOpen(false);
  };
  const handleNumberOk = () => {
    setIsModalNumberOpen(false);
  };
  const handleCancel = () => {
    setDataUserEdit({});
    setIsModalOpen(false);
  };
  const handleNumberCancel = () => {
    setIsModalNumberOpen(false);
  };
  const columns = [
    {
      title: "Mã thiết bị",
      dataIndex: "deviceCode",
      key: "deviceCode",
    },
    {
      title: "Tên thiết bị",
      dataIndex: "deviceName",
      key: "deviceName",
    },
    {
      title: "Địa chỉ IP",
      dataIndex: "ipAddress",
      key: "ipAddress",
    },
    {
      title: "Trạng thái hoạt động",
      dataIndex: "operationStatus",
      key: "operationStatus",
      render: (status: string) =>
        status === "Active" ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Ngừng hoạt động</Tag>
        ),
    },
    {
      title: "Trạng thái kết nối",
      dataIndex: "connected",
      key: "connected",
      render: (connection: string) =>
        connection === "Connected" ? (
          <Tag color="green">Kết nối</Tag>
        ) : (
          <Tag color="red">Mất kết nối</Tag>
        ),
    },
    {
      title: "",
      key: "actions",
      render: (text: string, record: any, index: number) => (
        <>
          <a href="#" style={{ marginRight: 10 }}
          >
            Xóa
          </a>
          <a href="#"
            onClick={() => {
              setDataUserEdit(record);
              setIsModalOpen(true);
            }}
          >Cập nhật</a>
        </>
      ),
    },
  ];
  const columnsSvc = [
    {
      title: "Mã dịch vụ",
      dataIndex: "serviceCode",
      key: "serviceCode",
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "servicName",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Trạng thái hoạt động",
      dataIndex: "isInOperation",
      key: "isInOperation",
      render: (status: string) =>
        status === "Active" ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="red">Ngừng hoạt động</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: () => (
        <>
          <a href="#" style={{ marginRight: 10 }} >
            Chi tiết
          </a>
          <a href="#"
          >Cập nhật</a>
        </>
      ),
    },
  ];
  const renderStatus = React.useCallback((status: string) => {
    return status === "Đang online" ? (
      <Tag color="blue">{status}</Tag>
    ) : (
      <Tag color="red">{status}</Tag>
    );
  }, []);
  const renderActions = React.useCallback((text: string, record: any, index: number) => {
    return (
      <>
        {localStorage.getItem('userRole') != 'Doctor' && localStorage.getItem('userRole') != 'Staff' ?
          <a href="#" style={{ marginRight: 10 }}
            onClick={() => {
              setIsModelDeleteOpen(true);
              setDeletedEmail(record.email);
            }}>
            Xóa
          </a> : null}
        <a
          href="#"
          onClick={() => {
            setDataUserEdit(record);
            setIsModalOpen(true);
          }}
        >
          Cập nhật
        </a>
      </>
    );
  }, [setDataUserEdit, setIsModalOpen]);
  const deleteUser = async (email: string) => {
    return new Promise(resolve => {
      fetch(process.env.REACT_APP_API_URL + 'api/User/' + email, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }).then(response => response.json())
        .then(async (data: string) => {
          resolve(data);
        })
        .catch(error => console.log(error))
    })
  }
  const columnsUser = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Vai trò",
      dataIndex: "userRole",
      key: "userRole"
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (_: any, record: any) => {
        console.log(record.isActive);
        return (
          <Switch checked={record.isActive} />)
      }
    },
    {
      title: "",
      key: "actions",
      render: renderActions
    },
  ];
  const columnsPN = [
    {
      title: "STT",
      dataIndex: "code",
      key: "code",
      render: (text: string, record: any, index: number) => {
        if (localStorage.getItem('userRole') == 'Doctor')
          return (
            <a href='#' onClick={() => {

            }}>{text}</a>
          )
        else
          return (<span>{text}</span>)
      }
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Thời gian cấp",
      dataIndex: "assignmentDate",
      key: "assignmentDate",
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "expireDate",
      key: "expireDate",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) =>
        status === "Đang chờ" ? (
          <Tag color="blue">{status}</Tag>
        ) : status === "Đã sử dụng" ? (
          <Tag color="gray">{status}</Tag>
        ) : (<Tag color="red">{status}</Tag>)
    },
    {
      title: "Nguồn cấp",
      dataIndex: "deviceCode",
      key: "deviceCode",
    },
    {
      title: "",
      key: "actions",
      render: (record: any) => (
        <>
          <a href="#" style={{ marginRight: 10 }}
            onClick={() => {
              if (props.columns == 3) {
                fetch(process.env.REACT_APP_API_URL + 'api/Assignment/' + record.code + '/1', {
                  method: 'PUT',
                  headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
                }).then(res => res.json())
                  .then(async (data) => {
                    if (data.message == 'Updated') {
                      let temp = await getProvidedNumber("All", "2000-01-01", "2050-12-12", "All", "___", 1, 5, "-1");
                      setData(temp);
                      setCurrentPage(1);
                    }
                  })
                  .catch(error => console.log(error));
              }
            }}
          >
            {props.columns == 3 ? 'Khám' : 'Chi tiết'}
          </a>
        </>
      ),
    },
  ];

  useEffect(() => {
    async function GetPM() {
      let temp = await getProvidedNumber("All", "2000-01-01", "2050-12-12", "All", "___", 1, 5, "-1");
      setData(temp);
    }
    if (props.columns == 3) {
      GetPM();
    }
  }, [props.columns]);

  // Tách riêng SignalR event handlers - chỉ đăng ký một lần khi connection thay đổi
  useEffect(() => {
    if (connection != null) {
      const handleron = (userEmail: string) => {
        console.log("OnlineNotify received:", userEmail);
        dispatch(userSlice.actions.updateUsersStore({ email: userEmail, isActive: true }))
      };
      const handleroff = (userEmail: string) => {
        console.log("OfflineNotify received:", userEmail);
        dispatch(userSlice.actions.updateUsersStore({ email: userEmail, isActive: false }))
      };
      const handleAssignment = async (status: boolean) => {
        if (status && props.columns == 3) {
          let temp = await getProvidedNumber("All", "2000-01-01", "2050-12-12", "All", "___", 1, 5, "-1");
          let count = await getTotalNumber('All', '2000-01-01', '2050-12-31', 'All', '___', 'All')
          setRowCount(count);
          setData(temp);
        }
      };
      connection.on("AssignmentUpdated", handleAssignment);
      connection.on("OnlineNotify", handleron);
      connection.on("OfflineNotify", handleroff);
      return () => {
        connection.off("AssignmentUpdated", handleAssignment);
        connection.off("OnlineNotify", handleron);
        connection.off("OfflineNotify", handleroff);
      };
    }
  }, [connection, dispatch, props.columns]);
  return (
    <div className="device-list">
      <div className="top-bar">
        <h2>{props.headerText}</h2>
        <UserSection count={displayData.filter((x: any) => x.status == 'Đang chờ').length} />
      </div>
      {/* User section */}
      {/* Filters */}
      <div className="filters">
        <div className="leftFilterItem">
          <div className="filterItem">
            <span style={{ marginBottom: '5px' }}>{props.filter1}</span>
            <Select defaultValue="Tất cả" style={{ width: 180 }} className="filter"
            >
              {props.columns == 1 || props.columns == 2 ? DeviceStatus.map(item => {
                return (
                  <Option value={item.value}>{item.label}</Option>
                )
              })
                : props.columns == 4 ? UserRole.map(item => {
                  return (
                    <Option value={item.value}>{item.label}</Option>
                  )
                })
                  : <><Option value="All">Tất cả</Option>
                    {serviceOptions.map(item => {
                      return (
                        <Option value={item.value}>{item.label}</Option>
                      )
                    })}
                  </>
              }
            </Select>
          </div>
          <div className="filterItem">
            <span style={{ marginBottom: '5px' }}>{props.filter2}</span>
            <Select defaultValue="Tất cả" style={{ width: 180 }} className="filter"
            >
              {props.columns == 1 ? DeviceConnected.map(item => {
                return (
                  <Option value={item.value}>{item.label}</Option>
                )
              })
                : props.columns == 2 ? <Option value='All'>Tất cả</Option>
                  : props.columns == 4 ? UserStatus.map(item => {
                    return (
                      <Option value={item.value}>{item.label}</Option>
                    )
                  })
                    :
                    NumberStatus.map(item => {
                      return (
                        <Option value={item.value}>{item.label}</Option>
                      )
                    })
              }
            </Select>
          </div>
        </div>
        <div className="leftFilterItem">
          <div className="filterItem">
            <span style={{ marginBottom: '5px' }}>Từ khóa</span>
            <Input
              placeholder="Nhập từ khóa"
              value={searchText}
              onChange={async (e) => {

              }}
              style={{ width: 240 }}
              suffix={<SearchOutlined />}
            />
          </div>
        </div>
      </div>
      <div className="middleData">
        <Table style={{ width: '88%' }}
          rowKey={props.columns == 3 ? 'email' : 'deviceCode'}
          dataSource={props.columns != 4 ? data : storeData}
          columns={props.columns == 1 ? columns : props.columns == 2 ? columnsSvc : props.columns == 3 ? columnsPN : columnsUser}
          loading={{ spinning: loading, delay: 200 }}
          pagination={props.columns == 1 || props.columns == 2 || props.columns == 4 ? { pageSize: 8 } : customPagination}
          className="device-table"
        />
        <div style={{ width: '10%', marginLeft: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
          {localStorage.getItem('userRole') != 'Doctor' && localStorage.getItem('userRole') != 'Staff' ? <AddDeviceButton sendStatus={receiveStatus} headerText={props.buttonText} /> : null}
        </div>
      </div>
      <Modal title="" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} onClose={() => {
        setDataUserEdit({});
      }}
        width="60%" footer={null}
        style={{ padding: "20px" }} // Optional: Customize padding
      >
        {props.columns == 3 ? <NewQueueForm serviceOptions={serviceOptions}
          isNumberDisplay={receiveIsNumberDisplay}
        /> : props.columns == 4 ? <AccountForm myForm={dataUserEdit} serviceOptions={serviceOptions}
          handleSendStatus={receiveStatus}
        /> : props.columns == 1 ? <DeviceForm myForm={dataUserEdit} serviceOptions={serviceOptions}
          handleSendStatus={receiveStatus} />
          : <ServiceForm />
        }
      </Modal>
      <Modal title="" open={isModelNumberOpen} onOk={handleNumberOk} onCancel={handleNumberCancel}
        footer={null} className="custom-modal"
      >
        <TicketDisplay ticketNumber={newNumber} serviceName={serviceName} issueTime={assignmentDate}
          customerName={customerName} expiryTime="Trong ngày"
        />
      </Modal>
      <Modal title="Confirm Delete" open={isModelDeleteOpen} onOk={async () => {
        await deleteUser(deletedEmail);
        setIsModelDeleteOpen(false);
        setLoading(true);

      }} onCancel={() => { setIsModelDeleteOpen(false) }}
        className="custom-modal"
      >
        <h3>Bạn thật sự muốn xóa tài khoản này?</h3>
      </Modal>
    </div>
  );
});
export default DeviceList;
