/**
 * 投票内容详情页面
 */

import { NavBar, List, Card, Button, Toast, Avatar, Space } from "antd-mobile";
import { useParams, useNavigate } from "react-router-dom";
import { CheckOutline } from "antd-mobile-icons";
import { useState, useEffect } from "react";
import store from "./store";
import axios from "axios";
import { useImmer } from "use-immer";

export default () => {
  const navigate = useNavigate();
  // @ts-ignore 投票信息
  const [voteInfo, setVoteInfo] = useImmer();
  // 按钮是否禁用
  const [disabled, setDisabled] = useImmer(false);
  // 是否投票过,默认没有投票过
  const [hasVoted, setHasVoted] = useState(false);
  // 当前投票选中状态
  const [checkedIdx, setCheckedIdx] = useState(-1);
  // 按钮上面的提示文字
  const [buttonStr, setButtonStr] = useState("");
  // 是否展示头像
  const [isShowAvatar, setIsShowAvatar] = useState(false);
  // 组件刚加载出来, 获取当前voteId, 根据voteId来查找相关信息;
  // 获取voteId;
  const { id } = useParams();
  // 引入状态文件
  const { curLoginUser } = store;
  useEffect(() => {
    axios
      .get("vote/" + id)
      .then((res) => res.data.data)
      .then((data) => {
        console.log(data);
        setVoteInfo(data);
        handleVoteData(data);
      });
  }, []);

  const handleVoteData = (obj: any) => {
    const allSupporter = obj.options.map((i: any) => i.supporterId).flat();
    if (allSupporter.includes(curLoginUser)) {
      // 当前用户已经投票过的情况
      setHasVoted(true);
      // 1. 先找出用户投票的选项
      const voteIdx = obj.options
        .map((i: any) => i.supporterId)
        .findIndex((i: any) => i.includes(curLoginUser));
      // 2. 设置默认显示投票选项
      setCheckedIdx(voteIdx);
      // 3. 设置button字段
      setButtonStr("显示详情");
      // 4. 设置默认disabled: true
    } else {
      // 当前用户已经投票过
      setHasVoted(false);
      // 1. 取消disabled
      setDisabled(true);
      // 2. button设置投票字段
      setButtonStr("投票");
    }
  };

  // 当点击选项时,设置关闭按钮禁用
  useEffect(() => {
    if (checkedIdx > -1 && !hasVoted) {
      setDisabled(false);
    }
  }, [checkedIdx]);

  /**
   * 处理所有的用户投票情况
   */
  const handleIsVoted = (arr: object[]) => {
    // 获得所有投过票的人的id
    const allSupporter = arr.map((i: any) => i.supporterId).flat();
    if (allSupporter.includes(curLoginUser)) {
      // 用户已经投票过了
      setHasVoted(true);
      setButtonStr("显示详情");
      const idx = arr.findIndex((i: any) =>
        i.supporterId.includes("curLoginUser")
      );
      setCheckedIdx(idx);
    } else {
      // 用户还没有投票
      setButtonStr("投票");
    }
  };

  // 加载时候占位
  if (!voteInfo) {
    return <div> </div>;
  }

  /**
   * 处理点击投票按钮,将当前投票的id和
   */
  const handleSubmit = async () => {
    if (buttonStr === "显示详情") {
      setIsShowAvatar(true);
      return;
    }
    if (hasVoted) {
      Toast.show({
        icon: "fail",
        content: "您已经投票过",
      });
      return;
    }
    if (checkedIdx === -1) {
      Toast.show({
        icon: "fail",
        content: "请先投票再提交",
      });
      return;
    }
    // 发送提交信息到后台
    const res = await axios.post(`vote/${id}`, {
      checkedIdx,
      curLoginUser,
    });
    if (res.data.code) {
      Toast.show({
        icon: "success",
        content: "投票成功！",
      });
      window.location.reload();
      setHasVoted(true);
    }
  };

  return (
    <>
      <NavBar onBack={() => navigate("/home/me")}>投票详情</NavBar>
      <Card>{<h2>{voteInfo.title}</h2>}</Card>
      <Card>
        {voteInfo.desc}
        {voteInfo.voteType ? "[单选]" : "[多选]"}
      </Card>

      <List>
        {voteInfo.options.map((option: any, idx: number) => (
          <List.Item
            key={idx}
            extra={option.count}
            arrow={false}
            onClick={() => {
              setCheckedIdx(idx);
            }}
          >
            <Space direction="vertical">
              <div>
                <span style={{ fontSize: "18px" }}>{option.content}</span>
                <span>
                  {checkedIdx === idx && (
                    <CheckOutline color="var(--adm-color-primary)" />
                  )}
                </span>
              </div>
              {isShowAvatar && <AvatarList urlList={urlArr} />}
            </Space>
          </List.Item>
        ))}
      </List>
      <Card bodyStyle={{ color: "GrayText" }}>
        投票截至: {voteInfo.deadLine}
      </Card>

      <Button
        block
        color="primary"
        size="middle"
        disabled={disabled}
        onClick={handleSubmit}
      >
        {buttonStr}
      </Button>
    </>
  );
};

const urlArr = [
  "./../avatar/1.png",
  "./../avatar/2.png",
  "./../avatar/3.png",
  "./../avatar/4.png",
  "./../avatar/5.png",
  "./../avatar/6.png",
  "./../avatar/7.png",
  "./../avatar/8.png",
  "./../avatar/9.png",
  "./../avatar/10.png",
];

/**
 * 自定义头像列表组件,传入一个url数组
 */

const AvatarList = (props: { urlList: any[] }) => {
  return (
    <Space align={"center"}>
      {props.urlList.map((url, idx) => (
        <Avatar
          src={url}
          key={`${idx}`}
          style={{ "--size": "30px", "--border-radius": "50%" }}
        />
      ))}
    </Space>
  );
};
