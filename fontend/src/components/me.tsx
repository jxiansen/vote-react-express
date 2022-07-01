import { NavBar, Collapse, TabBar, Toast } from "antd-mobile";
import {
  EditSOutline,
  FileOutline,
  SendOutline,
  DeleteOutline,
  MinusOutline,
} from "antd-mobile-icons";
import { axiosInstance, store } from "./../config";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import "./../index.css";

export default () => {
  const [dataList, updateDataList] = useImmer([]);
  const [curEditIdx, updateCurEditIdx] = useImmer(-1);
  let navigate = useNavigate();
  // 组件最初加载时查看当前用户所创建的所有投票
  useEffect(() => {
    const { curLoginUser, token } = JSON.parse(localStorage.UserInfo);
    axiosInstance
      .get("/vote", {
        params: {
          userId: curLoginUser,
        },
      })
      .then((res) => {
        console.log(res);
        const list = res.data.data;
        // console.log(list);
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
    const result = await axiosInstance.delete(`vote/${voteId}`);
    updateDataList((dataList) => dataList.splice(curEditIdx, -1));
    Toast.show({
      icon: result.data.code ? "success" : "fail",
      content: result.data.message,
    });
    document.location.reload();
  };

  /**
   * 处理tabbar组件的切换行为
   */
  const handleChange = (key: String, idx: number) => {
    const voteId = dataList[curEditIdx]["_id"];
    if (key === "/edit") {
      navigate(`/createvote/${voteId}`);
    }
    if (key === "/view") {
      // 跳转到查看界面
      navigate(`/vote/${voteId}`, { replace: true });
      // 传递第二个参数对象, {replace: true} 不然跳转会在当前路径上拼接,而不是替代
    }
    if (key === "/share") {
      console.log("分享按钮");
    }
    if (key === "/delete") {
      const voteid = dataList[curEditIdx]["_id"];
      deleteVote(voteid);
    }
  };

  return (
    <div className="box">
      <NavBar className="nav" backArrow={false}>
        我的投票
      </NavBar>
      <Collapse accordion>
        {dataList.map((val: any, idx) => {
          return (
            <Collapse.Panel
              key={`${idx}`}
              title={`${val.title}`}
              onClick={() => updateCurEditIdx(idx)}
              arrow={(active) =>
                active ? <MinusOutline /> : <span>{`${val.allCounter}`}</span>
              }
            >
              <TabBars handleChange={handleChange} />
            </Collapse.Panel>
          );
        })}
      </Collapse>
    </div>
  );
};

/**
 * Tabbar组件
 */
const TabBars = (props: any) => {
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
