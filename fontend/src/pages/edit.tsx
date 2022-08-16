/*
 * 投票信息修改
 */
import { useEffect, useState } from "react";
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
  DotLoading,
} from "antd-mobile";
import { MinusCircleOutline, AddCircleOutline } from "antd-mobile-icons";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import client from "../client";
import { useRequest } from "ahooks";

export default () => {
  // 返回一个函数,这个函数中传递一个路径可以跳转到指定路径
  var navigate = useNavigate();
  // 获取投票参数
  let { id } = useParams();

  const { error, loading, data, mutate } = useRequest(() =>
    // @ts-ignore
    client.records.getOne("vote", id)
  );
  // 设置默认事件选择器是否显示
  const [visible, setVisible] = useState(false);
  // 设置时间选择器defaultValue
  const now = new Date();

  /**
   * 更新投票信息
   */

  const updateInfo = async () => {
    try {
      // @ts-ignore
      const record = await client.records.update("vote", id, data);
      console.log(record);
      Toast.show({
        icon: "success",
        content: "投票信息修改成功",
        afterClose() {
          navigate(`/vote/${id}`);
        },
      });
    } catch (err) {
      Toast.show({
        icon: "fail",
        content: "投票信息修改失败",
      });
      console.log(err);
    }
  };

  // 增加选项组
  const addOptions = () => {
    mutate((oldData: any) => {
      oldData.options.push({
        avatar: [],
        content: "",
        count: 0,
        supporterId: [],
      });
      return oldData;
    });
  };
  // 移除选项组
  const removeOption = (idx: number) => {
    mutate((oldData: any) => {
      oldData.options.splice(idx, 1);
      return oldData;
    });
  };
  // 处理options输入操作
  const editOptions = (val: string, idx: number) => {
    mutate((oldData: any) => {
      oldData.options[idx].content = val;
      return oldData;
    });
  };
  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <NavBar
        onBack={() => {
          navigate("/home/me");
        }}
      >
        修改投票信息
      </NavBar>

      {(() => {
        if (loading) {
          return (
            <div style={{ fontSize: 25, textAlign: "center" }}>
              <DotLoading color="primary" />
            </div>
          );
        }
        if (error) {
          return <h1>出错了</h1>;
        }
        return (
          <Form
            layout="horizontal"
            onFinish={updateInfo}
            footer={
              <Button block type="submit" color="primary" size="large">
                确认修改
              </Button>
            }
          >
            <Form.Item rules={[{ required: true, message: "标题不能为空" }]}>
              <Input
                placeholder="投票标题"
                style={{ "--font-size": "30px" }}
                // @ts-ignore
                value={data.title}
                onChange={(val) => {
                  mutate((oldData: any) => {
                    oldData.title = val;
                    return oldData;
                  });
                }}
              />
            </Form.Item>
            <Form.Item>
              <TextArea
                placeholder="补充描述(选填)"
                style={{ "--font-size": "22px" }}
                maxLength={50}
                // @ts-ignore
                value={data.desc}
                rows={2}
                showCount
                onChange={(val) => {
                  mutate((oldData: any) => {
                    oldData.desc = val;
                    return oldData;
                  });
                }}
              />
            </Form.Item>
            {/* @ts-ignore */}
            {data.options.map((option, idx) => {
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
                    mutate((oldData: any) => {
                      oldData.deadLine = `${value.toLocaleString()}`;
                      return oldData;
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
                // @ts-ignore
                checked={data.voteType}
                onChange={(val) => {
                  mutate((oldData: any) => {
                    oldData.voteType = val;
                    return oldData;
                  });
                }}
              />
            </Form.Item>
          </Form>
        );
      })()}
    </>
  );
};
