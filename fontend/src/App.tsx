import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout";
import CreateVote from "./CreateVote";
import Login from "./login";
import VoteView from "./voteView";
import Singup from "./singup";
import Create from "./components/create";
import Me from "./components/me";
import NoMatch from "./noMatch";

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
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Singup />} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

export default App;
