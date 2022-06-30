/**
 * 布局页面的bootomBar组件
 */

import { TabBar } from "antd-mobile";
import { UserOutline, AppOutline } from "antd-mobile-icons";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import "./../index.css";

export default () => {
  const [activeKey, setActiveKey] = useImmer("/home/me");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const key = location.pathname.split("/").pop();
    if (key === "me") setActiveKey("/home/me");
    if (key === "new") setActiveKey("/home/new");
  }, []);

  return (
    <TabBar
      className="bottom"
      defaultActiveKey={activeKey}
      onChange={(key) => {
        navigate(key);
      }}
    >
      <TabBar.Item key={"/home/new"} icon={<AppOutline />} title={"新建"} />
      <TabBar.Item key={"/home/me"} icon={<UserOutline />} title={"我的"} />
    </TabBar>
  );
};
