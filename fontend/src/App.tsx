import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout";
// import SelectCreation from "../../vote-fontend/src/SelectCreation";
import CreateVote from "./CreateVote";
import Login from "./login";
import VoteView from "./voteView";
import Singup from "./singup";
import Create from "./components/create";
import Me from "./components/me";

function App() {
  return (
    <div>
      <Routes>
        {/* 打开根路径 "/" 默认跳转到/home 路径 */}
        <Route path="/" element={<Layout />}>
          <Route path="new" element={<Create />} />
          <Route path="me" element={<Me />} />
        </Route>
        <Route path="/vote/:id" element={<VoteView />} />
        <Route path="create" element={<CreateVote />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Singup />} />
      </Routes>
    </div>
  );
}

export default App;
