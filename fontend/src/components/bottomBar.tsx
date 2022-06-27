import { TabBar } from "antd-mobile";
import { UserOutline, AppOutline } from "antd-mobile-icons";
import "./../index.css";

const tabs = [
  {
    key: "/create",
    title: "新建",
    icon: <AppOutline />,
  },
  {
    key: "/me",
    title: "我的",
    icon: <UserOutline />,
  },
];

export default () => {
  return (
    <>
      <TabBar className="bottom">
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    </>
  );
};
