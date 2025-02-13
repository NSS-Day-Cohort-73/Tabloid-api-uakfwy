const _apiUrl = "/api/subscription";

export const getSubscriptionsByUserId = (userId) => {
  return fetch(`${_apiUrl}/${userId}`).then((res) => res.json());
};

export const createSubscription = (subscription) => {
  return fetch(`${_apiUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscription),
  }).then((res) => res.json());
};

export const deleteSubscription = (id) => {
  return fetch(`${_apiUrl}/${id}`, {
    method: "DELETE",
  });
};
