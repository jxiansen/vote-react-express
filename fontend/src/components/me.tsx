import { NavBar, Collapse, TabBar } from "antd-mobile";
import {
  EditSOutline,
  FileOutline,
  SendOutline,
  DeleteOutline,
} from "antd-mobile-icons";
import React from "react";
import "./../index.css";

const tabs = [
  {
    key: "/edit",
    title: "编辑",
    icon: <EditSOutline />,
    operate: "",
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

const TabBars = () => {
  return (
    <TabBar>
      {tabs.map((item) => (
        <TabBar.Item
          key={item.key}
          icon={item.icon}
          title={item.title}
          // onClick={() => console.log(12)}
        />
      ))}
    </TabBar>
  );
};

export default () => {
  const dataList = ["吃饭", "睡觉", "打豆豆"];

  return (
    <div className="box">
      <NavBar className="nav">我的投票</NavBar>
      <Collapse defaultActiveKey={["1"]}>
        {dataList.map((val, idx) => {
          return (
            <Collapse.Panel key={`${idx}`} title={val}>
              <TabBars />
            </Collapse.Panel>
          );
        })}
      </Collapse>
    </div>
  );
};
