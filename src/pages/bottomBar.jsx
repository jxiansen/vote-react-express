/**
 * 布局页面的bootomBar组件
 */

import { TabBar } from "antd-mobile";
import { UserOutline, AppOutline } from "antd-mobile-icons";
import { useNavigate, useLocation } from "react-router-dom";

export default () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  console.log(location);
  return (
    <TabBar
      className="bottom"
      activeKey={pathname}
      onChange={(key) => {
        navigate(key);
      }}
    >
      <TabBar.Item key="/home/new" icon={<AppOutline />} title="新建" />
      <TabBar.Item key="/home/me" icon={<UserOutline />} title="我的" />
    </TabBar>
  );
};
