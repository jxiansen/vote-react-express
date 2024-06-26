/**
 * 投票内容详情页面
 */

import {
  NavBar,
  List,
  Card,
  Button,
  Toast,
  Avatar,
  Space,
  ProgressCircle,
} from "antd-mobile";
import { useParams, useNavigate } from "react-router-dom";
import { CheckOutline } from "antd-mobile-icons";
import { useState, useEffect, useRef } from "react";
import { axiosInstance } from "../config";
import { useImmer } from "use-immer";

export default () => {
  const navigate = useNavigate();
  // 先查看本地是否有用户信息,没有跳转到登录界面,重定向以后本地就可以读取到用户信息

  const curLoginUser = localStorage.curLoginUser;
  const [voteInfo, setVoteInfo] = useImmer({
    title: "",
    desc: "",
    deadLine: "",
    voteType: true,
    options: [
      {
        content: "",
        count: 0,
        supporterId: [],
      },
      {
        content: "",
        count: 0,
        supporterId: [],
      },
    ],
    allCounter: 0,
  });

  const checkIdx = useRef(-1);
  // 按钮是否禁用,默认是没有投票过的
  const [disabled, setDisabled] = useImmer(true);
  // 是否投票过,默认没有投票过
  const [hasVoted, setHasVoted] = useState(false);
  // 当前投票选中状态
  const [checkedIdx, setCheckedIdx] = useState(-1);
  // 是否展示头像
  const [isShowAvatar, setIsShowAvatar] = useState(false);
  // 组件刚加载出来, 获取当前voteId, 根据voteId来查找相关信息;
  // 获取voteId;
  const { id } = useParams();
  // 引入状态文件

  /**
   * 组件开始先获取当前投票信息
   */

  useEffect(() => {
    axiosInstance.get("vote/" + id).then((data) => {
      handleVoteData(data);
    });
  }, []);

  const handleVoteData = (obj) => {
    const { hasVoted } = obj;
    // 当前用户已经投票过的情况
    if (hasVoted) {
      setHasVoted(true);
      setVoteInfo(obj.data);

      // 1. 先找出用户投票的选项
      const voteIdx = obj.data.options
        .map((i) => i.supporterId)
        .findIndex((i) => i.includes(curLoginUser));
      // 2. 设置默认显示投票选项
      checkIdx.current = voteIdx;
      setCheckedIdx(voteIdx);
      return;
    }
    // 没有投票过的情况
    setVoteInfo(obj.data);
  };

  /**
   * 组件每次重新渲染时监控投票选项
   */

  useEffect(() => {
    if (checkedIdx !== -1) {
      setDisabled(false);
    }
    if (hasVoted && checkedIdx !== checkIdx.current) {
      Toast.show({
        icon: "fail",
        content: "您已经投票过",
      });
      setCheckedIdx(checkIdx.current);
    }
  }, [checkedIdx]);

  /**
   * 处理投票提交选项
   */
  const handleSubmit = async () => {
    if (hasVoted) {
      setIsShowAvatar(true);
      return;
    }
    if (checkedIdx === -1) {
      Toast.show({
        icon: "fail",
        content: "请先投票再提交",
      });
      return;
    }

    const curLoginUser = localStorage.curLoginUser;
    const res = await axiosInstance.post(`vote/${id}`, {
      checkedIdx,
      curLoginUser,
    });
    // @ts-ignore
    if (res.code) {
      Toast.show({
        icon: "success",
        content: "投票成功！",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  /**
   * 小数转百分数,传入分子和分母
   */
  // const toPercent = (point, numerator) => {
  //   if (numerator === 0) {
  //     return 0;
  //   }
  //   return Math.floor((point / numerator) * 100);
  // };

  return (
    <>
      <NavBar onBack={() => navigate("/home/me")}>投票详情</NavBar>
      <Card>{<h2>{voteInfo.title}</h2>}</Card>
      <Card>
        {voteInfo.desc}
        {voteInfo.voteType ? "[单选]" : "[多选]"}
      </Card>

      <List>
        {voteInfo.options.map((option, idx) => (
          <List.Item
            key={idx}
            extra={
              <Space align="center">
                <span>{option.count}票 &nbsp;&nbsp;&nbsp;</span>
                <span>
                  {/* <ProgressCircle
                    style={{ "--size": "35px", fontSize: "12px" }}
                    percent={toPercent(option.count, voteInfo.allCounter)}
                  >
                    {toPercent(option.count, voteInfo.allCounter).toString() +
                      "%"}
                  </ProgressCircle> */}
                </span>
              </Space>
            }
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
              {/* {isShowAvatar && <AvatarList urlList={option.avatar} />} */}
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
        {hasVoted ? "显示详情" : "投票"}
      </Button>
    </>
  );
};

/**
 * 自定义头像列表组件,传入一个url数组
 */

// const AvatarList = (props: { urlList  }) => {
//   return (
//     <Space align={"center"}>
//       {props.urlList.map((url, idx) => (
//         <Avatar
//           src={url}
//           key={`${idx}`}
//           style={{ "--size": "30px", "--border-radius": "50%" }}
//         />
//       ))}
//     </Space>
//   );
// };
