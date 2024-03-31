import { Button, Space, Avatar, Form, Input, NavBar, Toast } from "antd-mobile";

import { useNavigate } from "react-router-dom";

import { authWithPassword } from "../services/user";

import { useState } from "react";

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  /**
   * 根据用户名和密码提交信息登录
   */

  function login(data) {
    if (loading) {
      return;
    }
    setLoading(true);

    authWithPassword(data)
      .then((res) => {
        navigate("/home/me");
      })
      .catch((err) => {
        Toast.show({
          icon: "fail",
          content: "登录失败",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

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
          onFinish={login}
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
}

export default LoginPage;
