import { Outlet } from "react-router-dom";
import BottomBar from "./bottomBar";
import "./../index.css";

export default () => {
  return (
    <div className="box">
      <Outlet />
      <BottomBar />
    </div>
  );
};
