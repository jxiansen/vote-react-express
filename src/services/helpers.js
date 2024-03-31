export function validateValueRequired(val, message = "") {
  if (val === void 0) {
    return Promise.reject({
      message,
    });
  }

  return Promise.resolve(true);
}

export function validateUserId(userId) {
  return validateValueRequired(userId, "userId is required!");
}

export function validateVoteId(voteId) {
  return validateValueRequired(voteId, "voteId is required!");
}

export function validateOptionId(optionId) {
  return validateValueRequired(optionId, "optionId is required!");
}
