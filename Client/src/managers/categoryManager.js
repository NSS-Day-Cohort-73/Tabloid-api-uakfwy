const _apiUrl = "/api/category";

export const getAllCategories = () => {
  return fetch(_apiUrl).then((res) => res.json());
};

export const postNewCategory = (category) => {
  return fetch(_apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(category),
  }).then((res) => res.json());
};

export const updateCategory = (categoryId, catObj) => {
  return fetch(`${_apiUrl}/${categoryId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(catObj),
  });
};
