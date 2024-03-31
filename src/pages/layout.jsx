import { Outlet } from "react-router-dom";
import BottomBar from "./bottomBar";

export default () => {
  return (
    <div className="box">
      <Outlet />
      <BottomBar />
    </div>
  );
};
