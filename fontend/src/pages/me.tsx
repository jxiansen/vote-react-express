import {
  NavBar,
  Collapse,
  TabBar,
  Toast,
  Avatar,
  ActionSheet,
  DotLoading,
} from "antd-mobile";
import {
  EditSOutline,
  FileOutline,
  SendOutline,
  DeleteOutline,
  MinusOutline,
} from "antd-mobile-icons";
import client from "../client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useImmer } from "use-immer";
import type { Action } from "antd-mobile/es/components/action-sheet";
import { useRequest } from "ahooks";
import "./../index.css";

export default () => {
  const [avatar, setAvatar] = useImmer("");
  const [curEditIdx, updateCurEditIdx] = useImmer(-1);
  const [visible, setVisible] = useImmer(false);
  let navigate = useNavigate();

  // 组件最初加载时查看当前用户所创建的所有投票
  const { data, error, loading, mutate } = useRequest(() =>
    client.records.getFullList("vote", 200)
  );

  // 组件一加载获取头像地址
  useEffect(() => {
    try {
      const { model } = JSON.parse(localStorage.pocketbase_auth);
      const { id } = model;
    } catch (err) {
      Toast.show({
        icon: "fail",
        content: "您还未登录，请登录后查看信息",
        afterClose() {
          navigate("/login");
        },
      });
    }
    client.records.getFullList("user").then((data: any) => {
      data = data[0];
      let url = `http://mr-j.ml:4520/api/files/${data["@collectionId"]}/${data.id}/${data.avatar}`;
      setAvatar(url);
    });
  }, []);

  /**
   * 根据voteId来删除对应的投票信息
   */
  const deleteVote = async (voteId: any) => {
    mutate((olddata: any) => {
      olddata.splice(curEditIdx, 1);
      return olddata;
    });
    const result = await client.records.delete("vote", voteId);
    console.log(result);
    // 删除操作反馈信息
    Toast.show({
      content: result ? "删除成功" : "删除失败",
      duration: 1000,
    });
  };

  /**
   * 处理tabbar组件的切换行为
   */
  const handleChange = (key: String, idx: number) => {
    // @ts-ignore
    const voteId = data[curEditIdx].id;
    // console.log(key, voteId);
    if (key === "/edit") {
      navigate(`/edit/${voteId}`);
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
          content: "分享链接已经复制到粘贴板中\n,快分享你的朋友吧👌",
        });
      });
    }
    if (key === "/delete") {
      deleteVote(voteId);
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
            onClick={() => {
              setVisible(true);
              console.log(123);
            }}
          />
        }
      >
        我的投票
      </NavBar>

      {/* 使用立即执行表达式来根据状态给予状态提示 */}

      {(() => {
        if (loading)
          return (
            <span style={{ fontSize: 25, textAlign: "center" }}>
              <DotLoading color="primary" />
            </span>
          );
        if (error) {
          return (
            <span style={{ fontSize: 25, textAlign: "center" }}>
              <p>获取用户数据失败</p>
            </span>
          );
        }
        return (
          <>
            <Collapse accordion>
              {/* @ts-ignore */}
              {data.map((val: any, idx) => {
                return (
                  <Collapse.Panel
                    key={`${idx}`}
                    title={`${val.title}`}
                    onClick={() => updateCurEditIdx(idx)}
                    arrow={(active) =>
                      active ? (
                        <MinusOutline />
                      ) : (
                        <span>{`${val.allCounter}`}</span>
                      )
                    }
                  >
                    <TabBars handleChange={handleChange} />
                  </Collapse.Panel>
                );
              })}
            </Collapse>
            <ActionSheet
              extra={`Hello, `}
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
          </>
        );
      })()}
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
    text: "退出",
    key: "signout",
    description: "退出后需重新登录",
    danger: true,
  },
];
