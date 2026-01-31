import {useState, useEffect, useContext} from "react";
import { Button, Form, Input, message } from 'antd';
import  './Login.css';
import { GetLogin } from "./Login.logic";
import { SignalRContext } from "../../helpers/SignalRProvider";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useAppDispatch } from "../../libraries/hook";
import { getUserData } from "../dashboard/Dashboard.logic";
import { userSlice } from "../../store/userReducers";

type LoginProps = {
  handleSuccess: (isLogined:boolean) => void
}
const Login = (props: LoginProps) =>{
  const [form] = Form.useForm();
  const connection = useContext(SignalRContext);
   const dispatch = useAppDispatch();
  const handleFinish = async (value:any) => {
      console.log(value.userName); console.log(value.password);
      let dataLogin = await GetLogin(value.userName, value.password);
      console.log(dataLogin);
      if(dataLogin.message){
        message.info("Sai tên đăng nhập hoặc mật khẩu");
      }
      else{
        localStorage.setItem("userFullName", dataLogin.userFullName);
        localStorage.setItem("userName", dataLogin.userCode);
        localStorage.setItem('token', dataLogin.token);
        localStorage.setItem('refreshToken', dataLogin.tokenRefresh);
        localStorage.setItem('avatar', dataLogin.avatar);
        localStorage.setItem('userRole', dataLogin.userRole);
          let temp = await getUserData();
        dispatch(userSlice.actions.addUsersToStore(localStorage.getItem('userRole')!='Doctor'?temp:temp.filter((x:any)=>x.email==localStorage.getItem('userName'))))
        props.handleSuccess(true);
        
      }
  }
  return(
       <div className="login">
  <div className="login_col1">
    <div className="login_form">
        <img src='./images/Logo.png' className="login_imgLogo" />
      <Form className=""
        // name="basic"
        layout="vertical"
        requiredMark={false}
        autoComplete="on"
        style={{ width: "100%" }}
        form={form} onFinish={handleFinish}
      >
        <Form.Item
          label="Tên đăng nhập"
          name="userName"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
        >
          <Input className="login_custom-input"  />
        </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
      >
        <Input.Password
          className="login_custom-input"
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined 
            />
          }
        />
      </Form.Item>

      <div className="login_forgot">
        <a href="#">Quên mật khẩu?</a>
      </div>

      <Form.Item>
        <Button className="login_btn-login"  type='primary' htmlType="submit">
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
    </div>
  </div>

  <div className="login_col2">

     <img src="./images/introduction.png" className="img" />  
    <div className="login_hero-text">
      <p className="login_hero-sub">Hệ thống</p>
      <p className="login_hero-title">QUẢN LÝ XẾP HÀNG</p>
    </div>
  </div>
</div>
        
    )
}
export default Login;