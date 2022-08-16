/**
 * 用户登录组件
 */

import { Button, Space, Avatar, Form, Input, NavBar, Toast } from "antd-mobile";
import client from "../client";
import { useNavigate } from "react-router-dom";
import "./../index.css";

export default () => {
  const navigate = useNavigate();
  /**
   * 根据邮箱和密码提交信息登录,登录成功后SDK客户端会自动在 header 中放置 Authorization
   */

  const login = async (data: any) => {
    Toast.show({
      icon: "loading",
      content: "正在登录",
    });
    // 尝试登录,
    try {
      console.log(data);
      const { email, password } = data;
      const userAuthData = await client.users.authViaEmail(email, password);
      console.log(userAuthData);
      Toast.show({
        icon: "success",
        content: "登录成功",
        afterClose: () => {
          navigate("/");
        },
      });
    } catch (err) {
      console.log(err);
      Toast.show({
        icon: "fail",
        content: "登录失败",
      });
    }
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
            name="email"
            label="邮箱"
            rules={[{ required: true, message: "邮箱不能为空" }]}
          >
            <Input placeholder="请输入邮箱" />
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
