import { validateVoteId } from "./helpers";
import pb from "./index";

export function listVote() {
  const curUser = pb.authStore.model?.id;
  const payload = {
    sort: "-created",
    // fields: "title,id",
  };

  if (curUser) {
    payload.creater = curUser;
  }

  return pb.collection("vote").getFullList(payload);
}

export function createVote(data) {
  return pb.collection("vote").create(data);
}

export function deleteVote(voteId) {
  return validateVoteId(voteId).then(() =>
    pb.collection("vote").delete(voteId)
  );
}

export function updateVote(voteId, data) {
  return validateVoteId(voteId).then(() =>
    pb.collection("vote").update(voteId, data)
  );
}
