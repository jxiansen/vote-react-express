import { useState } from "react";
import { useImmer } from "use-immer";
import {
  Form,
  Input,
  Button,
  Dialog,
  TextArea,
  DatePicker,
  Switch,
  NavBar,
  Space,
} from "antd-mobile";
import { MinusCircleOutline, AddCircleOutline } from "antd-mobile-icons";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default () => {
  // 根据路由地址判断是单选投票还是多选投票,如果路径有问题,跳转到单选投票路由
  let [searchParams, setSearchParams] = useSearchParams();
  var voteTypeStr;
  if (searchParams.get("type") === "single") {
    voteTypeStr = "单选";
  } else if (searchParams.get("type") === "multiple") {
    voteTypeStr = "多选";
  } else {
    setSearchParams({ type: "single" });
  }
  // 设置默认事件选择器是否显示
  const [visible, setVisible] = useState(false);
  // 设置时间选择器defaultValue
  const now = new Date();
  const onFinish = (values: any) => {
    Dialog.alert({
      content: <pre>{JSON.stringify(values, null, 2)}</pre>,
    });
  };
  // 选项数组
  const [options, updateOptions] = useImmer([""]);
  // 增加选项组
  const addOptions = () => {
    updateOptions((options) => {
      options.push(""); // options是草稿,直接对其操作
    });
  };
  // 移除选项组
  const removeOption = (idx: number) => {
    updateOptions((options) => {
      options.splice(idx, 1);
    });
  };
  // 处理options输入操作
  const editOptions = (e: string, idx: number) => {
    updateOptions((options) => {
      options[idx] = e;
    });
  };
  // 记录截至时间
  const [deadLine, setDeadLine] = useState();
  // 表单提交
  const submitInfo = async (data: any) => {
    const voteInfo = {
      ...data,
      options,
      deadLine,
      voteType: searchParams.get("type"),
    };
    console.log(voteInfo);
    axios
      .post("http://127.0.0.1:4523/mock/1161313/vote", {
        firstName: "Fred",
        lastName: "Flintstone",
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <>
      <NavBar onBack={() => console.log(`返回`)}>
        创建{`${voteTypeStr}`}投票
      </NavBar>
      <Form
        layout="horizontal"
        onFinish={(data) => submitInfo(data)}
        footer={
          <Button block type="submit" color="primary" size="large">
            提交
          </Button>
        }
      >
        <Form.Item
          name="title"
          rules={[{ required: true, message: "标题不能为空" }]}
        >
          <Input placeholder="投票标题" style={{ "--font-size": "30px" }} />
        </Form.Item>
        <Form.Item name="description">
          <TextArea
            placeholder="补充描述(选填)"
            style={{ "--font-size": "22px" }}
            maxLength={50}
            rows={2}
            showCount
          />
        </Form.Item>
        {options.map((option, idx) => {
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
                  value={option}
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
              onConfirm={(date: Date) => {
                setDeadLine(date);
              }}
              precision="minute"
            >
              {(value) => value?.toLocaleString()}
            </DatePicker>
          </div>
        </Form.Item>
        <Form.Item
          name="isAnonymous"
          label="匿名投票"
          childElementPosition="right"
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name="restriction"
          label="限制传播"
          childElementPosition="right"
        >
          <Switch />
        </Form.Item>
      </Form>
    </>
  );
};