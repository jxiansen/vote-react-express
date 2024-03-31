import { validateUserId } from "./helpers";
import pb from "./index";

export function getMyInfo() {
  return pb.authStore.model;
}

export function getUserInfo(userId) {
  const params = {
    fields: "?fields=id,name,avatar",
  };
  return validateUserId(userId).then(() =>
    pb.collection("users").getOne(userId, params)
  );
}
// fields: "?fields=name,avatar,address.city,address.state",

export function updateUserInfo(userId) {}

export function deleteUser(userId) {}

export function createUser(data) {
  return pb.collection("users").create(data);
}

export function authWithPassword(data) {
  const { username, password } = data || {};
  console.log(username, password);
  return pb.collection("users").authWithPassword(username, password);
}
