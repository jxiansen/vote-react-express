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
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import store from "./store";

export default () => {
  const { curLoginUser } = store;
  // 存储投票信息
  const [voteInfo, setVoteInfo] = useImmer({
    createrId: curLoginUser,
    title: "",
    desc: "",
    deadLine: "",
    options: [],
    voteType: false,
  });
  const [voteTypeStr, updateVoteTypeStr] = useImmer("");
  // 返回一个函数,这个函数中传递一个路径可以跳转到指定路径
  var navigate = useNavigate();
  // 根据路由地址判断是单选投票还是多选投票,如果路径有问题,跳转到单选投票路由
  let [searchParams, setSearchParams] = useSearchParams();
  // 获取投票参数
  const { id } = useParams();

  useEffect(() => {
    // 如果是进入投票编辑界面
    if (id) {
      axios
        .get(`vote/${id}`)
        .then((res) => res.data.data)
        .then((data) => {
          data.options = data.options.map(
            (obj: { content: any }) => obj.content
          );
          setVoteInfo(data);
        });
      return;
    }
    // 设定默认为 single 单选投票
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

  /**
   * 表单提交
   */

  const submitInfo = async () => {
    const cloneVoteInfo = deepClone(voteInfo);
    cloneVoteInfo.options = cloneVoteInfo.options.map((item: any) => ({
      content: item,
    }));
    const res = await axios.post("/vote", cloneVoteInfo);
    // 返回的res数据中包含创建好的voteid,根据此id跳转到对应的查看路由
    const { voteId, message, code } = res.data;
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
        创建{`${voteTypeStr}`}投票
      </NavBar>

      <Form
        layout="horizontal"
        onFinish={submitInfo}
        footer={
          <Button block type="submit" color="primary" size="large">
            提交
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

/**
 * 深拷贝函数
 */

const deepClone = (obj: any) => {
  if (obj === null) return null;
  let clone = Object.assign({}, obj);
  Object.keys(clone).forEach(
    (key) =>
      (clone[key] =
        typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key])
  );
  if (Array.isArray(obj)) {
    clone.length = obj.length;
    return Array.from(clone);
  }
  return clone;
};
