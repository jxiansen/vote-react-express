import {
  NavBar,
  Collapse,
  TabBar,
  Toast,
  Avatar,
  ActionSheet,
} from "antd-mobile";
import { List, Switch } from "antd-mobile";
import {
  EditSOutline,
  FileOutline,
  SendOutline,
  DeleteOutline,
  MinusOutline,
} from "antd-mobile-icons";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo } from "@/services/user";

function RenderMePage() {
  const [userInfo, setUserInfo] = useState(() => getMyInfo());
  const { avatar, collectionId, id, name } = userInfo || {};
  const naviagte = useNavigate();

  const avatarUrl = `${
    import.meta.env.VR_BACKEND_URL
  }/api/files/${collectionId}/${id}/${avatar}`;
  console.log(avatarUrl);
  return (
    <div className="box">
      <NavBar className="nav" backArrow={null}>
        我的
      </NavBar>

      <div className="page-me-avatar-container">
        <div className="avatar-container-content">
          <Avatar className="avatar" src={avatarUrl} />
          <h3>{name || ""}</h3>
        </div>
      </div>

      <List>
        <List.Item
          onClick={() => {
            naviagte("/myVote");
          }}
        >
          我的投票
        </List.Item>
        <List.Item
          onClick={() => {
            naviagte("/setting");
          }}
        >
          个人设置
        </List.Item>
        <List.Item onClick={() => {}}>反馈建议</List.Item>
        <List.Item onClick={() => {}}>隐私协议</List.Item>
        <List.Item onClick={() => {}}>服务协议</List.Item>
      </List>
    </div>
  );
}

/**
 * Tabbar组件
 */
const TabBars = (props) => {
  const tabs = [
    {
      key: "/edit",
      title: "编辑",
      icon: <EditSOutline />,
    },
    {
      key: "/view",
      title: "查看",
      icon: <FileOutline />,
    },
    {
      key: "/share",
      title: "分享",
      icon: <SendOutline />,
    },
    {
      key: "/delete",
      title: "删除",
      icon: <DeleteOutline />,
    },
  ];
  return (
    <TabBar
      defaultActiveKey={"/view"}
      onChange={(key) => props.handleChange(key)}
    >
      {tabs.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  );
};

/**
 * 头像点击行为
 */
const actions = [
  { text: "复制", key: "copy" },
  { text: "修改", key: "edit", disabled: true },
  {
    text: "登出",
    key: "signout",
    description: "退出后需重新登录",
    danger: true,
  },
];

export default RenderMePage;
