/**
 * 用户登录组件
 */
import PocketBase from "pocketbase";
import {
  Button,
  Space,
  Form,
  Input,
  NavBar,
  ImageUploader,
  Toast,
} from "antd-mobile";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../client";
export default () => {
  const navigate = useNavigate();

  /**
   * 上传注册信息
   */
  const signup = async (data: any) => {
    Toast.show({
      icon: "loading",
      content: "提交注册信息",
    });
    try {
      // 注册成功跳转到登录界面
      console.log(data);
      client.users.create(data);
      Toast.show({
        icon: "success",
        content: "注册成功",
        afterClose: () => {
          navigate("/login");
        },
      });
    } catch (err) {
      console.log(err);
      // 提示操作结果
      Toast.show({
        icon: "fail",
        content: "注册失败,请检查输入信息",
      });
    }
  };

  return (
    <>
      <NavBar backArrow={false}>用户注册</NavBar>
      <Space
        block
        direction="vertical"
        align="center"
        style={{ "--gap": "30px", marginTop: "30px" }}
      >
        <Form
          layout="horizontal"
          onFinish={signup}
          footer={
            <Button block type="submit" color="primary" size="large">
              注册用户
            </Button>
          }
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true },
              { type: "string", min: 6 },
              { type: "email", warningOnly: true },
            ]}
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
          <Form.Item
            name="passwordConfirm"
            label="确认密码"
            rules={[{ required: true, message: "密码不能为空" }]}
          >
            <Input placeholder="两次密码需要一致" />
          </Form.Item>
          {/* <Form.Item name="avatar" label="上传头像">
            <ImageUploader
              maxCount={1}
              value={fileList}
              onChange={setFileList}
              upload={uploadAvatar}
            />
          </Form.Item> */}
        </Form>
      </Space>
    </>
  );
};
