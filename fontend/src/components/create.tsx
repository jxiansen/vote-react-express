// @ts-nocheck
import { NavBar, Button, Toast } from "antd-mobile";
import { FileOutline, UnorderedListOutline } from "antd-mobile-icons";
import "./../index.css";
import { useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate();

  return (
    <div className="box">
      <NavBar className="nav">创建投票</NavBar>
      <div className="card">
        <FileOutline className="icon" />
        <Button
          color="primary"
          size="large"
          onClick={() => {
            navigate("/createvote?type=single");
          }}
        >
          单选投票
        </Button>
      </div>
      <div className="card">
        <UnorderedListOutline className="icon" />
        <Button
          color="primary"
          size="large"
          onClick={() => {
            navigate("/createvote?type=multiple");
          }}
        >
          多选投票
        </Button>
      </div>
    </div>
  );
};
