/**
 * 布局页面的bootomBar组件
 */

import { TabBar } from "antd-mobile";
import { UserOutline, AppOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";
import "./../index.css";

export default () => {
  const navigate = useNavigate();

  return (
    <TabBar
      className="bottom"
      activeKey={location.pathname}
      onChange={(key) => {
        navigate(key);
      }}
    >
      <TabBar.Item key={"/home/new"} icon={<AppOutline />} title={"新建"} />
      <TabBar.Item key={"/home/me"} icon={<UserOutline />} title={"我的"} />
    </TabBar>
  );
};
