/**
 * 投票内容详情页面
 */

import { NavBar, List, Space, Card, Button, Toast } from "antd-mobile";
import { useParams } from "react-router-dom";
import { CheckOutline } from "antd-mobile-icons";
import { useState, useEffect } from "react";
import axios from "axios";
export default () => {
  const [voteInfo, setVoteInfo] = useState<any>();
  // 组件刚加载出来, 获取当前voteId,根据voteId来查找相关信息
  // 获取voteId
  const { id } = useParams();
  useEffect(() => {
    axios.get("http://localhost:5000/vote/" + id).then((res) => {
      setVoteInfo(res.data.data);
    });
  }, [id]);

  /**
   * 检查自己是否投过票
   */
  const isVoted = async (res: any) => {
    const arr = res.options
      .map((val: any) => val.supporterId)
      .filter((i: any) => !!i);
    return !!arr.length;
  };

  // 当前投票选中状态
  const [checkedIdx, setCheckedIdx] = useState(-1);

  // 加载时候占位
  if (!voteInfo) {
    return <div> </div>;
  }
  return (
    <>
      <NavBar>投票详情</NavBar>
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
            onClick={() => setCheckedIdx(idx)}
          >
            {option.content}
            {checkedIdx === idx && (
              <CheckOutline color="var(--adm-color-primary)" />
            )}
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
        disabled
        onClick={() => console.log(checkedIdx)}
      >
        投票
      </Button>
    </>
  );
};
