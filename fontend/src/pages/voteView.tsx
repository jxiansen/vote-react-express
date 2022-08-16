/**
 * 投票内容详情页面
 */
// @ts-nocheck
import {
  NavBar,
  List,
  Card,
  Button,
  Toast,
  Avatar,
  Space,
  ProgressCircle,
  DotLoading,
} from "antd-mobile";
import { useParams, useNavigate } from "react-router-dom";
import { CheckOutline } from "antd-mobile-icons";
import { useState, useEffect } from "react";
import client from "../client";
import { useImmer } from "use-immer";
import { useRequest } from "ahooks";

export default () => {
  const navigate = useNavigate();
  // 先查看本地是否有用户信息,没有跳转到登录界面,重定向以后本地就可以读取到用户信息

  // 按钮是否禁用,默认是没有投票过的
  const [disabled, setDisabled] = useImmer(false);
  // 是否投票过,默认没有投票过
  const [hasVoted, setHasVoted] = useState(false);
  // 当前投票选中状态
  const [checkedIdx, setCheckedIdx] = useState(-1);
  // 是否展示头像
  const [isShowAvatar, setIsShowAvatar] = useState(false);
  // 组件刚加载出来, 获取当前voteId, 根据voteId来查找相关信息;
  // 获取voteId;
  const { id } = useParams();

  /**
   * 组件开始先获取当前投票信息
   */

  const { data, error, loading, mutate } = useRequest(() =>
    // @ts-ignore
    client.records.getOne("vote", id)
  );

  useEffect(() => {
    // 当请求到数据时的操作
    if (data) {
      // 1. 判断当前用户是否已经投票过
      let allVotedUser = data.options.map((i) => i.supporterId).flat();
      const { model } = JSON.parse(localStorage.pocketbase_auth);
      const { id } = model;
      // 2. 对于投票过的，找出投票第几项,并设置
      if (allVotedUser.includes(id)) {
        console.log("已经投票过");
        setHasVoted(true);
        const idx = data.options.findIndex((item) =>
          item.supporterId.includes(id)
        );
        setCheckedIdx(idx);
      }
      console.log(data);
      console.log(allVotedUser);
    }
  }, [data]);

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
    try {
      // 从 localStorage 中读取 userId
      const { model } = JSON.parse(localStorage.pocketbase_auth);
      const { id } = model;
      mutate((data: any) => {
        data.options[checkedIdx].supporterId.push(id);
        data.options[checkedIdx].count =
          data.options[checkedIdx].supporterId.length;
        data.allCounter++;
        return data;
      });
      const record = await client.records.update("vote", data.id, data);
      console.log(record);
      Toast.show({
        icon: "success",
        content: "投票成功！",
        duration: 1000,
        afterClose() {
          window.location.reload();
        },
      });
    } catch (err) {
      console.log(err);
      Toast.show({
        icon: "fail",
        content: "投票失败",
      });
    }
  };

  /**
   * 小数转百分数,传入分子和分母
   */
  const toPercent = (point: number, numerator: number): number => {
    if (numerator === 0) {
      return 0;
    }
    return Math.floor((point / numerator) * 100);
  };

  return (
    <>
      <NavBar onBack={() => navigate("/home/me")}>投票详情</NavBar>
      {(() => {
        if (loading)
          return (
            <div style={{ fontSize: 25, textAlign: "center" }}>
              <DotLoading color="primary" />
            </div>
          );
        if (error) {
          return <h1>获取数据失败</h1>;
        }
        return (
          <>
            {" "}
            <Card>{<h2>{data.title}</h2>}</Card>
            <Card>
              {data.desc}
              {data.voteType ? "[单选]" : "[多选]"}
            </Card>
            <List>
              {data.options.map((option: any, idx: number) => (
                <List.Item
                  key={idx}
                  extra={
                    <Space align="center">
                      <span>{option.count}票 &nbsp;&nbsp;&nbsp;</span>
                      <span>
                        <ProgressCircle
                          style={{ "--size": "35px", fontSize: "12px" }}
                          percent={toPercent(option.count, data.allCounter)}
                        >
                          {toPercent(option.count, data.allCounter).toString() +
                            "%"}
                        </ProgressCircle>
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
                    {isShowAvatar && <AvatarList urlList={option.avatar} />}
                  </Space>
                </List.Item>
              ))}
            </List>
            <Card bodyStyle={{ color: "GrayText" }}>
              投票截至: {data.deadLine}
            </Card>
            <Button
              block
              color="primary"
              size="middle"
              disabled={disabled}
              onClick={handleSubmit}
            >
              {hasVoted ? "查看投票详情" : "投票"}
            </Button>
          </>
        );
      })()}
    </>
  );
};

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
