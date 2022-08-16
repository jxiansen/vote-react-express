import { useState } from "react";
import { useImmer } from "use-immer";
import {
  Form,
  Input,
  Button,
  TextArea,
  DatePicker,
  Switch,
  NavBar,
  Toast,
  Space,
} from "antd-mobile";
import { MinusCircleOutline, AddCircleOutline } from "antd-mobile-icons";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import client from "../client";
import { cloneDeep } from "lodash";

export default () => {
  // 存储投票信息
  const [voteInfo, setVoteInfo] = useImmer({
    title: "",
    desc: "",
    options: [],
    deadLine: "",
    allCounter: 0,
    anyoumous: false,
    limit: false,
    voteType: false,
  });
  // 返回一个函数,这个函数中传递一个路径可以跳转到指定路径
  var navigate = useNavigate();
  // 根据路由地址判断是单选投票还是多选投票,如果路径有问题,跳转到单选投票路由
  let [searchParams, setSearchParams] = useSearchParams();
  // 获取投票参数
  let { id } = useParams();

  // 设置默认事件选择器是否显示
  const [visible, setVisible] = useState(false);
  // 设置时间选择器defaultValue
  const now = new Date();

  /**
   * 表单提交
   */
  const submitInfo = async () => {
    // 将对象深拷贝一下
    let clone = cloneDeep(voteInfo);
    // @ts-ignore
    clone.options = voteInfo.options.map((i) => ({
      content: i,
      supporterId: [],
      avatar: [],
      count: 0,
    }));
    try {
      // 提交表单信息并获取返回
      const record = await client.records.create("vote", clone);
      console.log(record);
      // // 当提交后显示后台操作结果反馈
      Toast.show({
        icon: "success",
        content: "创建投票信息成功",
        duration: 1500,
        afterClose: () => {
          navigate(`/vote/${record.id}`);
        },
      });
    } catch (err) {
      console.log(err);
      Toast.show({
        icon: "fail",
        content: "创建投票信息失败",
      });
    }
  };

  // 增加选项组
  const addOptions = () => {
    setVoteInfo((draft: any) => {
      draft.options.push("");
    });
  };
  // 移除选项组
  const removeOption = (idx: number) => {
    setVoteInfo((draft) => {
      draft.options.splice(idx, 1);
    });
  };
  // 处理options输入操作
  const editOptions = (val: string, idx: number) => {
    setVoteInfo((draft: any) => {
      draft.options[idx] = val;
    });
  };

  return (
    <>
      <NavBar
        onBack={() => {
          navigate("/home/me");
        }}
      >
        {searchParams.get("type") === "single"
          ? "创建单选投票"
          : "创建多选投票"}
      </NavBar>

      <Form
        layout="horizontal"
        onFinish={submitInfo}
        footer={
          <Button block type="submit" color="primary" size="large">
            完成
          </Button>
        }
      >
        <Form.Item rules={[{ required: true, message: "标题不能为空" }]}>
          <Input
            placeholder="投票标题"
            style={{ "--font-size": "30px" }}
            value={voteInfo.title}
            onChange={(val) => {
              setVoteInfo((draft) => {
                draft.title = val;
              });
            }}
          />
        </Form.Item>
        <Form.Item>
          <TextArea
            placeholder="补充描述(选填)"
            style={{ "--font-size": "22px" }}
            maxLength={50}
            value={voteInfo.desc}
            rows={2}
            showCount
            onChange={(val) => {
              setVoteInfo((draft) => {
                draft.desc = val;
              });
            }}
          />
        </Form.Item>
        {voteInfo.options.map((option, idx) => {
          return (
            <Form.Item key={idx}>
              <Space align={"center"}>
                <MinusCircleOutline
                  style={{ fontSize: 30 }}
                  color="#ff634f"
                  onClick={() => removeOption(idx)}
                />
                <Input
                  placeholder="选项"
                  // @ts-ignore
                  value={option.content}
                  onChange={(e) => editOptions(e, idx)}
                />
              </Space>
            </Form.Item>
          );
        })}
        <Form.Item>
          <Space align={"center"} onClick={addOptions}>
            <AddCircleOutline
              style={{ fontSize: 30 }}
              color="var(--adm-color-primary)"
            />
            <span style={{ color: "blue" }}>添加选项</span>
          </Space>
        </Form.Item>
        <Form.Item label="截至日期" childElementPosition="right">
          <div
            onClick={() => {
              setVisible(true);
            }}
          >
            <DatePicker
              title="投票截止日期"
              defaultValue={now}
              visible={visible}
              mouseWheel={true}
              onClose={() => {
                setVisible(false);
              }}
              onConfirm={(value: Date) => {
                setVoteInfo((draft) => {
                  draft.deadLine = `${value.toLocaleString()}`;
                });
              }}
              precision="minute"
            >
              {(value) => value?.toLocaleString()}
            </DatePicker>
          </div>
        </Form.Item>
        <Form.Item label="匿名投票" childElementPosition="right">
          <Switch
            checked={voteInfo.voteType}
            onChange={(val) => {
              setVoteInfo((draft) => {
                draft.voteType = val;
              });
            }}
          />
        </Form.Item>
      </Form>
    </>
  );
};
