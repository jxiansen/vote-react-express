import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/layout";
import CreateVote from "./pages/CreateVote";
import Login from "./pages/login";
import VoteView from "./pages/voteView";
import Singup from "./pages/singup";
import Create from "./pages/create";
import Me from "./pages/me";
import NoMatch from "./pages/noMatch";
import Edit from "./pages/edit";
import Test from "./pages/test";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/home/new" />} />
      <Route path="home" element={<Layout />}>
        <Route path="new" element={<Create />} />
        <Route path="me" element={<Me />} />
      </Route>
      <Route path="createvote" element={<CreateVote />} />
      <Route path="createvote/:id" element={<CreateVote />} />
      <Route path="vote/:id" element={<VoteView />} />
      <Route path="edit/:id" element={<Edit />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Singup />} />
      <Route path="test" element={<Test />} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

export default App;
