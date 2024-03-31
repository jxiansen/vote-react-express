import { useEffect, useState } from "react";
import {
  Input,
  Button,
  List,
  TextArea,
  DatePicker,
  Switch,
  NavBar,
  Toast,
  Space,
} from "antd-mobile";
import { MinusCircleOutline, AddCircleOutline } from "antd-mobile-icons";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { createOption } from "@/services/option";

function VoteForm() {
  // 根据路由地址判断是单选投票还是多选投票,如果路径有问题,跳转到单选投票路由
  let [searchParams, setSearchParams] = useSearchParams();
  // 获取投票参数
  const { id: voteId } = useParams();
  const [visible, setVisible] = useState(false);
  const [title, setTile] = useState("");
  const [desc, setDesc] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [endTime, setEndTime] = useState(new Date());
  const [anymous, setAnymous] = useState(false);
  const [limit, setLimit] = useState(false);

  const curLoginUser = localStorage.curLoginUser;

  // 返回一个函数,这个函数中传递一个路径可以跳转到指定路径
  var navigate = useNavigate();

  useEffect(() => {
    setNavBar();
    // 如果是进入投票编辑界面
    // if (id) {
    //   axiosInstance
    //     .get(`vote/${id}`)
    //     .then((res) => res.data)
    //     .then((data) => {
    //       data.options = data.options.map(
    //         (obj: { content }) => obj.content
    //       );
    //       setVoteInfo(data);
    //     });
    //   return;
    // }
  }, []);

  /**
   * 根据路location的不同设置不同的navbar
   */
  const setNavBar = () => {
    if (voteId) {
      updateNavbarStr("修改投票信息");
    }
    if (searchParams.get("type") === "single") {
      updateNavbarStr("创建单选投票");
    }
    if (searchParams.get("type") === "multiple") {
      updateNavbarStr("创建多选投票");
    }
  };

  const popupDatePicker = () => {
    setVisible(true);
  };

  const hiddenDatePicker = () => {
    setVisible(false);
  };

  /**
   * 表单提交
   */
  const submitForm = () => {
    batchCreateOptions().then((res) => {
      console.log(res);
    });
    return;
    const res = {};
    // 返回的res数据中包含创建好的voteid,根据此id跳转到对应的查看路由
    const { voteId, message, code } = res;
    // 当提交后显示后台操作结果反馈
    Toast.show({
      icon: code ? "success" : "fail",
      content: message,
    });
    if (code) {
      setTimeout(() => {
        navigate(`/vote/${voteId}`);
      }, 2000);
    }
  };

  const batchCreateOptions = async () => {
    try {
      for (let option of options) {
        await createOption({ label: option });
      }
      return Promise.resolve(true);
    } catch (e) {
      Toast.show({
        icon: "fail",
        content: e,
      });
    }
  };

  /**
   * 更新投票信息
   */
  const updateVoteInfo = async () => {
    const res = {};
    Toast.show({
      icon: res.code ? "success" : "fail",
      content: res.message,
    });
    if (res.code) {
      setTimeout(() => {
        navigate(`/vote/${voteId}`);
      }, 2000);
    }
  };

  const addOption = () => {
    setOptions((pre) => [...pre, ""]);
  };

  const removeOption = (optionIdx) => {
    const _options = options.filter((_, idx) => idx !== optionIdx);
    setOptions(_options);
  };

  const editOption = (newVal, optionIdx) => {
    const _options = options.map((val, idx) => {
      if (idx === optionIdx) {
        return newVal;
      }
      return val;
    });
    setOptions(_options);
  };

  return (
    <>
      <NavBar
        onBack={() => {
          navigate("/home/me");
        }}
      >
        {voteId ? "修改投票" : "创建投票"}
      </NavBar>
      <Input
        placeholder="投票标题"
        style={{ "--font-size": "25px" }}
        value={title}
        onChange={setTile}
      />
      <TextArea
        placeholder="补充描述(选填)"
        style={{ "--font-size": "20px" }}
        maxLength={50}
        value={desc}
        rows={2}
        showCount
        onChange={setDesc}
      />
      {options.map((option, idx) => {
        return (
          <Space key={idx} align={"center"}>
            <MinusCircleOutline
              style={{ fontSize: 25 }}
              color="#ff634f"
              onClick={() => removeOption(idx)}
            />
            <Input
              placeholder="选项"
              value={option}
              onChange={(e) => editOption(e, idx)}
            />
          </Space>
        );
      })}
      <div>
        <Space align={"center"} onClick={addOption}>
          <AddCircleOutline
            style={{ fontSize: 25 }}
            color="var(--adm-color-primary)"
          />
          <span style={{ color: "blue" }}>添加选项</span>
        </Space>
      </div>

      <List style={{ marginTop: 20 }}>
        <List.Item
          extra={
            <div onClick={popupDatePicker}>
              <DatePicker
                title="投票"
                value={endTime}
                visible={visible}
                mouseWheel={true}
                onClose={hiddenDatePicker}
                onConfirm={(value) => {
                  console.log(value);
                  setEndTime(value);
                }}
              >
                {(value) => value?.toDateString()}
              </DatePicker>
            </div>
          }
        >
          截止日期
        </List.Item>
        <List.Item extra={<Switch checked={anymous} onChange={setAnymous} />}>
          匿名投票
        </List.Item>
        <List.Item extra={<Switch checked={limit} onChange={setLimit} />}>
          限制传播
        </List.Item>
      </List>

      <div style={{ padding: "25px 15px" }}>
        <Button
          block
          type="submit"
          color="primary"
          size="large"
          onClick={submitForm}
        >
          完成
        </Button>
      </div>
    </>
  );
}

export default VoteForm;
