import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
// import SelectCreation from "../../vote-fontend/src/SelectCreation";
import CreateVote from "./CreateVote";
import Login from "./login";

function App() {
  return (
    <div>
      <Routes>
        {/* 打开根路径 "/" 默认跳转到/home 路径 */}
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path="/home" element={<Home />}>
          <Route path="" element={<Navigate replace to="create" />} />
          {/* <Route path="create" element={<SelectCreation />} /> */}
          <Route path="me" element={<h1>me</h1>} />
        </Route>
        <Route path="/vote/:id" element={<div>vote/:id</div>} />
        <Route path="create" element={<CreateVote />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;