import pb from ".";
import { validateOptionId } from "./helpers";

export function createOption(data) {
  return pb.collection("option").create(data);
}

export function updateOption(optionId, data) {
  return validateOptionId(optionId).then(() =>
    pb.collection("option").update(optionId, data)
  );
}

export function deleteOption(optionId) {
  return validateOptionId(optionId).then(() =>
    pb.collection("option").delete(optionId)
  );
}
