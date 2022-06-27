import { Outlet } from "react-router-dom";
import BottomBar from "./components/bottomBar";
import "./index.css";

export default () => {
  return (
    <div className="box">
      <Outlet />
      <BottomBar />
    </div>
  );
};
