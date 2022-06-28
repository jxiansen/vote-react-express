import { useEffect, useState } from "react";
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
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default () => {
  const [voteTypeStr, updateVoteTypeStr] = useImmer("");
  // 返回一个函数,这个函数中传递一个路径可以跳转到指定路径
  var navigate = useNavigate();
  // 根据路由地址判断是单选投票还是多选投票,如果路径有问题,跳转到单选投票路由
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("type") === "single") {
      updateVoteTypeStr("单选");
    } else if (searchParams.get("type") === "multiple") {
      updateVoteTypeStr("多选");
    } else {
      setSearchParams({ type: "single" });
      updateVoteTypeStr("单选");
    }
  }, []);

  // 设置默认事件选择器是否显示
  const [visible, setVisible] = useState(false);
  // 设置时间选择器defaultValue
  const now = new Date();

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
  const [deadLine, setDeadLine] = useState("");

  /**
   * 表单提交
   */

  const submitInfo = async (data: any) => {
    const voteInfo = {
      createrId: "62b5c41f86d4e6eb6e0925dd",
      title: data.title,
      desc: data.desc,
      deadLine,
      options: options.map((val) => ({
        content: `${val}`,
        count: 0,
      })),
      voteType: data.voteType,
    };
    const res = await axios.post("/vote", voteInfo);
    // 返回的res数据中包含创建好的voteid,根据此id跳转到对应的查看路由
    const { voteId, message, code } = res.data;
    console.log(voteId, message, code);
    // 当提交后显示后台操作结果反馈
    Toast.show({
      icon: code ? "success" : "fail",
      content: message,
    });
    if (code) {
      setTimeout(() => {
        navigate("/vote/" + voteId);
      }, 2000);
    }
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
        <Form.Item name="desc">
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
        <Form.Item
          name="deadLine"
          label="截至日期"
          childElementPosition="right"
        >
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
                setDeadLine(`${value.toLocaleString()}`);
              }}
              precision="minute"
            >
              {(value) => value?.toLocaleString()}
            </DatePicker>
          </div>
        </Form.Item>
        <Form.Item
          name="voteType"
          label="匿名投票"
          childElementPosition="right"
        >
          <Switch />
        </Form.Item>
      </Form>
    </>
  );
};
