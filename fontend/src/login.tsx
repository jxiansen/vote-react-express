/**
 * 用户登录组件
 */

import { Button, Space, Avatar, Form, Input, NavBar } from "antd-mobile";
import axios from "axios";

export default () => {
  const login = async (data: string) => {
    const res = await axios.post(
      "http://127.0.0.1:4523/mock/1161313/login",
      data
    );
    console.log(res);
  };

  return (
    <>
      <NavBar onBack={() => console.log(`返回`)}>用户登录</NavBar>
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
