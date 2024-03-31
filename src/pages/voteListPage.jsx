import { deleteVote, listVote } from "@/services/vote";
import {
  NavBar,
  Collapse,
  TabBar,
  Toast,
  Dialog,
  ActionSheet,
  Empty,
} from "antd-mobile";
import { List } from "antd-mobile";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FillinOutline,
  FileOutline,
  SendOutline,
  DeleteOutline,
} from "antd-mobile-icons";

const actions = [
  {
    key: "edit",
    title: "编辑",
    icon: <FillinOutline color="var(--adm-color-primary)" />,
  },
  {
    key: "check",
    title: "查看",
    icon: <FileOutline color="var(--adm-color-primary)" />,
  },
  {
    key: "share",
    title: "分享",
    icon: <SendOutline color="var(--adm-color-primary)" />,
  },
  {
    key: "delete",
    title: "删除",
    icon: <DeleteOutline color="var(--adm-color-primary)" />,
  },
];

function RenderVoteListPage() {
  const [voteList, setVoteList] = useState([]);
  const navigate = useNavigate();

  const refreshVoteList = () => {
    listVote().then((res) => {
      setVoteList(res);
      console.log(res);
    });
  };
  useEffect(() => {
    refreshVoteList();
  }, []);

  const handleClickItem = (activeKey, item) => {
    switch (activeKey) {
      case "edit":
        navigate("/create", { state: { mode: "modify" } });
        break;
      case "check":
        navigate(`/vote/${item.id}`);
        break;
      case "share":
        // navigate(`/vote/${item.id}`);
        break;
      case "delete":
        handleDeleteVote(item);
        break;

      default:
        break;
    }
    console.log(activeKey, item);
  };

  const handleDeleteVote = (item) => {
    Dialog.confirm({
      content: "确定要删除该投票吗？",
      onConfirm: () => {
        deleteVote(item.id)
          .then(() => {
            refreshVoteList();
          })
          .catch((e) => {
            Toast.show({
              icon: "fail",
              content: e,
            });
          });
      },
    });
  };

  return (
    <div className="box">
      <NavBar className="nav">我的投票</NavBar>

      {voteList.length > 0 ? (
        <Collapse>
          {voteList.map((item) => {
            const { id, title } = item || {};
            return (
              <Collapse.Panel key={id} title={title}>
                <div className="page-list-action-bar">
                  {actions.map((action) => {
                    const { key, icon, title } = action || {};
                    return (
                      <div
                        key={key}
                        className="action-item"
                        onClick={() => handleClickItem(key, item)}
                      >
                        <span className="action-item-icon">{icon}</span>
                        <span className="action-item-text">{title}</span>
                      </div>
                    );
                  })}
                </div>
              </Collapse.Panel>
            );
          })}
        </Collapse>
      ) : (
        <Empty description="暂无投票，快去创建吧！" />
      )}
    </div>
  );
}

export default RenderVoteListPage;
