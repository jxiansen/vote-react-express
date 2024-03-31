import { Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import Layout from "@/pages/layout";
import VoteForm from "@/pages/voteForm";
import Login from "@/pages/loginPage";

import Singup from "@/pages/singup";
import Create from "@/pages/create";
import Me from "@/pages/mePage";

import "@/assets/style.less";

import pb from "./services";

import VoteListPage from "./pages/voteListPage";
console.log(pb.authStore.model);
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate replace to="/home/new" />} />
        <Route path="home" element={<Layout />}>
          <Route path="new" element={<Create />} />
          <Route path="me" element={<Me />} />
        </Route>
        <Route path="create" element={<VoteForm />} />
        <Route path="/vote/:id" element={<VoteForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Singup />} />
        <Route path="/myVote" element={<VoteListPage />} />
        <Route path="*" element={<Create />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
