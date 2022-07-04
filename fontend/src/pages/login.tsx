/**
 * 用户登录组件
 */

import { Button, Space, Avatar, Form, Input, NavBar, Toast } from "antd-mobile";
import { axiosInstance } from "../config";
import { useNavigate } from "react-router-dom";
import "./../index.css";

export default () => {
  const navigate = useNavigate();
  /**
   * 根据用户名和密码提交信息登录
   */

  const login = (data: any) => {
    axiosInstance.post("/users/login", data).then((res) => {
      // @ts-ignore
      const { code, message, data } = res;
      Toast.show({
        icon: code ? "success" : "fail",
        content: message,
        afterClose: () => {
          navigate("/home/me");
        },
      });
      const { userId, token, avatar, username } = data;
      if (code) {
        localStorage.curLoginUser = userId;
        localStorage.username = username;
        localStorage.token = token;
        localStorage.avatar = avatar;
      }
    });
  };

  return (
    <>
      <NavBar
        onBack={() => {
          navigate("/signup");
        }}
      >
        用户登录
      </NavBar>
      <Space
        block
        direction="vertical"
        align="center"
        style={{ "--gap": "30px", marginTop: "30px" }}
      >
        <Avatar
          src={"avatar"}
          style={{ "--border-radius": "100%", "--size": "60px" }}
        />

        <Form
          layout="horizontal"
          onFinish={(data) => login(data)}
          footer={
            <Button block type="submit" color="primary" size="large">
              登录
            </Button>
          }
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: "用户名不能为空" }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: "密码不能为空" }]}
          >
            <Input placeholder="请输入密码" />
          </Form.Item>
        </Form>
      </Space>
      <p
        className="textCenter"
        onClick={() => {
          navigate("/signup");
        }}
      >
        尚未注册？点我
      </p>
    </>
  );
};
