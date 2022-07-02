import { useEffect } from "react";
import { Button, ErrorBlock } from "antd-mobile";
import { useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.body.style.background = "var(--adm-color-background)";
  }, []);
  return (
    <ErrorBlock
      status="empty"
      fullPage
      description="咦？被你发现了,这不是你该来的地方🤷‍♂️"
    >
      <Button
        color="primary"
        onClick={() => {
          navigate("/home/new", { replace: true });
        }}
      >
        点我回家🚀
      </Button>
    </ErrorBlock>
  );
};
