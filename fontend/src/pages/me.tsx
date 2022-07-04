import {
  NavBar,
  Collapse,
  TabBar,
  Toast,
  Avatar,
  ActionSheet,
} from "antd-mobile";
import {
  EditSOutline,
  FileOutline,
  SendOutline,
  DeleteOutline,
  MinusOutline,
} from "antd-mobile-icons";
import {
  axiosInstance,
  Redirect,
  RespData,
  useCopyToClipboard,
} from "../config";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import type { Action } from "antd-mobile/es/components/action-sheet";
import "./../index.css";
import { join } from "lodash";

export default () => {
  const [avatar, setAvatar] = useImmer("");
  const [dataList, updateDataList] = useImmer([]);
  const [curEditIdx, updateCurEditIdx] = useImmer(-1);
  const [visible, setVisible] = useImmer(false);
  let navigate = useNavigate();
  // 组件最初加载时查看当前用户所创建的所有投票
  useEffect(() => {
    // 先查看本地是否有用户信息,没有跳转到登录界面,重定向以后本地就可以读取到用户信息
    Redirect();
    let [curLoginUser, avatar] = [
      localStorage.curLoginUser,
      localStorage.avatar,
    ];
    setAvatar(avatar);
    axiosInstance
      .get("/vote", {
        params: {
          userId: curLoginUser,
        },
      })
      .then((res) => {
        console.log(res);
        // localStorage.setItem("allVote",JSON.stringify(res))
        updateDataList((draft) => {
          // @ts-ignore
          draft.push(...res.data);
        });
      });
  }, []);

  /**
   * 根据voteId来删除对应的投票信息
   */
  const deleteVote = async (voteId: String) => {
    const result: RespData = await axiosInstance.delete(`vote/${voteId}`);

    // 删除操作反馈信息
    Toast.show({
      icon: result.code ? "success" : "fail",
      content: result.message,
    });
    updateDataList((draft) => {
      draft.splice(curEditIdx, 1);
    });
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
      const url = `${location.host}/vote/${voteId}`;
      navigator.clipboard.writeText(url).then(() => {
        Toast.show({
          icon: "success",
          content: "分享链接已经复制到粘贴板中\n,快分享你的基友吧👌",
        });
      });
    }
    if (key === "/delete") {
      const voteid = dataList[curEditIdx]["_id"];
      deleteVote(voteid);
    }
  };

  return (
    <div className="box">
      <NavBar
        className="nav"
        backArrow={
          <Avatar
            src={avatar}
            style={{ "--size": "35px", "--border-radius": "50%" }}
            onClick={() => setVisible(true)}
          />
        }
      >
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
      <ActionSheet
        extra={`Hello, ${localStorage.username}😘`}
        cancelText="取消"
        visible={visible}
        actions={actions}
        onClose={() => setVisible(false)}
        onAction={(action: Action, index: number) => {
          if (action.key === "signout") {
            Toast.show({
              icon: "success",
              content: "退出账户成功！",
              afterClose: () => {
                localStorage.clear();
                navigate("/login");
              },
            });
          }
          if (action.key === "copy") {
            Toast.show({
              icon: "fail",
              content: "未完待码",
            });
          }
        }}
      />
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

/**
 * 头像点击行为
 */
const actions: Action[] = [
  { text: "复制", key: "copy" },
  { text: "修改", key: "edit", disabled: true },
  {
    text: "登出",
    key: "signout",
    description: "退出后需重新登录",
    danger: true,
  },
];
