const _apiUrl = "/api/comment";

export const getAllComments = (postId) => {
  return fetch(`${_apiUrl}/${postId}`).then((res) => res.json());
};

export const postNewComment = (comment) => {
  return fetch(_apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  }).then((res) => res.json());
};

export const deleteCommentById = (id) => {
  return fetch(`${_apiUrl}/${id}`, {
    method: "DELETE",
  });
};
