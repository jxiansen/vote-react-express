import {
  Button,
  Space,
  Form,
  Input,
  NavBar,
  ImageUploader,
  Toast,
} from "antd-mobile";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate();

  // 图像列表
  const [fileList, setFileList] = useState([
    {
      url: " ",
    },
  ]);

  // 用户上传的头像地址
  const [avatarUrl, setAvatar] = useState("");

  /**
   * 上传用户头像
   */

  // async function uploadAvatar(file) {
  //   // file是图片的Blob格式文件
  //   const formdata = new FormData();
  //   // 转换成formdata数据上传后端
  //   formdata.append("avatar", file, file.name);
  //   // 上传后端接口
  //   const res = await axiosInstance.post("/users/avatar", formdata);
  //   // 保存头像url
  //   setAvatar(res.data);
  //   // 提示操作结果
  //   Toast.show({
  //     icon: res.data ? "success" : "fail",
  //     // @ts-ignore
  //     content: res.message,
  //   });
  //   return {
  //     url: URL.createObjectURL(file),
  //   };
  // }

  /**
   * 上传注册信息
   */
  // const signup = async (data) => {
  //   data.avatar = avatarUrl;
  //   const respose = await axiosInstance.post("/users/signup", data);
  //   // 提示操作结果
  //   Toast.show({
  //     icon: respose.code ? "success" : "fail",
  //     content: respose.message,
  //     afterClose: () => {
  //       navigate("/login");
  //     },
  //   });
  //   // 注册成功跳转到登录界面
  // };

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
          // onFinish={(data) => signup(data)}
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
          <Form.Item name="avatar" label="上传头像">
            <ImageUploader
              maxCount={1}
              value={fileList}
              onChange={setFileList}
              upload={uploadAvatar}
            />
          </Form.Item>
        </Form>
      </Space>
    </>
  );
};
