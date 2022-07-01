/**
 * 用户登录组件
 */

import { Button, Space, Avatar, Form, Input, NavBar, Toast } from "antd-mobile";
import { axiosInstance } from "./config";
import { useNavigate } from "react-router-dom";
import { store } from "./config";

export default () => {
  const navigate = useNavigate();

  /**
   * 根据用户名和密码提交信息登录
   */

  const login = (data: any) => {
    axiosInstance
      .post("/users/login", data)
      .then((resp) => resp.data)
      .then((data) => {
        const { code, message, token, userId } = data;
        if (code) {
          localStorage.UserInfo = JSON.stringify({
            curLoginUser: userId,
            token: token,
          });
          // 提示操作结果
          Toast.show({
            icon: "success",
            content: message,
          });
          setInterval(() => {
            navigate("/home/me");
          }, 1500);
        } else {
          Toast.show({
            icon: "fail",
            content: message,
          });
        }
      })
      .catch((err) => {
        Toast.show({
          icon: "fail",
          content: "登录失败",
        });
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
          src=""
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
    </>
  );
};
