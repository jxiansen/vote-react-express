/**
 * 投票内容详情页面
 */

import { NavBar, List, Space, Card, Button, WaterMark } from "antd-mobile";
import { useParams } from "react-router-dom";
import { CheckOutline } from "antd-mobile-icons";
import { useState } from "react";
export default () => {
  // 获取当前voteId,根据voteId来查找相关信息
  const { id } = useParams();
  const data = {
    title: "晚饭吃啥",
    desc: "决策晚饭吃饭内容",
    options: ["黄焖鸡", "水饺", "肯德基"],
    deadLine: "2023-1-12",
    voteType: "single",
  };
  console.log(id);

  // 当前投票是否选中
  const [checkedIdx, setCheckedIdx] = useState(-1);
  return (
    <>
      <NavBar>投票详情</NavBar>
      {/* <Space direction="vertical" block align="center"> */}
      <Card>{<h2>{data.title}</h2>}</Card>
      <Card
      // bodyStyle={{ fontSize: "1rem" }}
      >
        {data.desc}
        {data.voteType === "single" ? "[单选]" : "[多选]"}
      </Card>
      <List>
        {data.options.map((option, idx) => {
          return (
            <List.Item
              key={idx}
              extra={"1票"}
              arrow={false}
              onClick={() => setCheckedIdx(idx)}
            >
              {option}
              {checkedIdx === idx && (
                <CheckOutline color="var(--adm-color-primary)" />
              )}
            </List.Item>
          );
        })}
      </List>
      <Card bodyStyle={{ color: "GrayText" }}>投票截至: {data.deadLine}</Card>
      {/* </Space> */}
    </>
  );
};
