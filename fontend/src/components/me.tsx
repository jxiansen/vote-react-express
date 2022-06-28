import { NavBar, Collapse, TabBar, Toast } from "antd-mobile";
import {
  EditSOutline,
  FileOutline,
  SendOutline,
  DeleteOutline,
} from "antd-mobile-icons";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import store from "./../store";

import "./../index.css";

export default () => {
  // const { curLoginUser } = store;
  const [dataList, updateDataList] = useImmer([]);
  const [curEditIdx, updateCurEditIdx] = useImmer(-1);
  let navigate = useNavigate();
  const curLoginUser = "62b5c41f86d4e6eb6e0925dd";
  // 组件最初加载时查看当前用户所创建的所有投票
  useEffect(() => {
    axios
      .get("/vote", {
        params: {
          userId: curLoginUser,
        },
      })
      .then((res) => {
        const list = res.data.data;
        console.log(list);
        updateDataList((dataList) => {
          // @ts-ignore
          dataList.push(...list);
        });
      });
  }, []);

  /**
   * 根据voteId来删除对应的投票信息
   */
  const deleteVote = async (voteId: String) => {
    const result = await axios.delete(`vote/${voteId}`);
    updateDataList((dataList) => dataList.splice(curEditIdx, -1));
    Toast.show({
      icon: result.data.code ? "success" : "fail",
      content: result.data.message,
    });
  };

  /**
   * 处理tabbar组件的切换行为
   */
  const handleChange = (key: String) => {
    if (key === "/edit") {
      navigate("/create");
    }
    if (key === "/view") {
      console.log("查看按钮");
    }
    if (key === "/share") {
      console.log("分享按钮");
    }
    if (key === "/delete") {
      const voteid = dataList[curEditIdx]["_id"];
      deleteVote(voteid);
    }
  };

  /**
   * Tabbar组件
   */
  const TabBars = () => {
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
      <TabBar defaultActiveKey={"/view"} onChange={(key) => handleChange(key)}>
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
        ))}
      </TabBar>
    );
  };

  return (
    <div className="box">
      <NavBar className="nav">我的投票</NavBar>
      <Collapse accordion>
        {dataList.map((val, idx) => {
          return (
            <Collapse.Panel
              key={`${idx}`}
              title={`${val.title}`}
              onClick={() => updateCurEditIdx(idx)}
            >
              <TabBars />
            </Collapse.Panel>
          );
        })}
      </Collapse>
    </div>
  );
};
