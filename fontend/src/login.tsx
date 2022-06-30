/**
 * 用户登录组件
 */

import { Button, Space, Avatar, Form, Input, NavBar, Toast } from "antd-mobile";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import store from "./store";

export default () => {
  const navigate = useNavigate();

  /**
   * 根据用户名和密码提交信息登录
   * @param {string} 用户提交的信息
   */

  const login = async (data: string) => {
    const res = await axios.post("/users/login", data);
    // 登录之后将token保存并跳转
    store.curLoginUser = res.data.userId;

    // 提示操作结果
    Toast.show({
      icon: res.data.code ? "success" : "fail",
      content: res.data.message,
    });
    if (res.data.code) {
      // 登录成功跳转到用户界面
      setInterval(() => {
        navigate("/home/new");
      }, 1500);
    }
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
