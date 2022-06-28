/**
 * 用户登录组件
 */

import {
  Button,
  Space,
  Avatar,
  Form,
  Input,
  NavBar,
  ImageUploader,
  Toast,
} from "antd-mobile";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:5000"; // 配置axios请求的地址

export default () => {
  const navigate = useNavigate();

  // 图像列表
  const [fileList, setFileList] = useState<ImageUploadItem[]>([
    {
      url: " ",
    },
  ]);

  // 用户上传的头像地址
  const [avatar, setAvatar] = useState("");

  /**
   * 上传用户头像
   */

  async function uploadAvatar(file: File) {
    // file是图片的Blob格式文件
    const formdata = new FormData();
    // 转换成formdata数据上传后端
    formdata.append("avatar", file, file.name);
    // 上传后端接口
    const res = await axios.post("/users/avatar", formdata);
    // 保存头像url
    setAvatar(res.data.data);
    const uploadRes = res.data.message;
    // 提示操作结果
    Toast.show({
      icon: res.data.code ? "fail" : "success",
      content: uploadRes,
    });
    return {
      url: URL.createObjectURL(file),
    };
  }

  /**
   * 上传注册信息
   */
  const signup = async (data: Object) => {
    const signupInfo = {
      ...data,
      avatar,
    };
    const respose = await axios.post("/users/signup", signupInfo);
    // 提示操作结果
    Toast.show({
      icon: respose.data.status === "success" ? "success" : "fail",
      content: `用户注册成功`,
    });
    // 注册成功跳转到登录界面
    setInterval(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <>
      <NavBar onBack={() => console.log(`返回`)}>用户注册</NavBar>
      <Space
        block
        direction="vertical"
        align="center"
        style={{ "--gap": "30px", marginTop: "30px" }}
      >
        <ImageUploader
          maxCount={1}
          value={fileList}
          onChange={setFileList}
          upload={uploadAvatar}
        >
          <Avatar
            src=""
            style={{ "--border-radius": "100%", "--size": "70px" }}
          />
        </ImageUploader>
        <Form
          layout="horizontal"
          onFinish={(data) => signup(data)}
          footer={
            <Button block type="submit" color="primary" size="large">
              注册用户
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
        </Form>
      </Space>
    </>
  );
};
