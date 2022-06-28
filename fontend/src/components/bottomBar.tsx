import { TabBar } from "antd-mobile";
import { UserOutline, AppOutline } from "antd-mobile-icons";
import { Link, useNavigate } from "react-router-dom";

import "./../index.css";

export default () => {
  const navigate = useNavigate();
  const tabs = [
    {
      key: "/home/new",
      title: "新建",
      icon: <AppOutline />,
    },
    {
      key: "/home/me",
      title: "我的",
      icon: <UserOutline />,
    },
  ];

  const handleChange = (key: any) => {
    navigate(key);
  };

  return (
    <TabBar className="bottom" onChange={(key) => handleChange(key)}>
      {tabs.map((item) => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  );
};
