const apiUrl = "/api/tag";

//Gets all Tags
//Can include an optional postId parameter to get tags associated with a specific post
//postId expects a Post Id
export const getTags = async (postId = null) => {
  const params = new URLSearchParams();

  if (postId !== null && postId > 0) {
    params.append("postId", postId);
  }
  const url = params.toString() ? `${apiUrl}?${params.toString()}` : apiUrl;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status ${response.status}`);
  }

  return response.json();
};

export const getTagById = (id) => {
  return fetch(`${apiUrl}/${id}`)
      .then((res) => {
          if (!res.ok) {
              throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
      });
};

export const updateTag = (tag) => {
  return fetch(`${apiUrl}/${tag.id}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(tag),
  })
  .then((res) => {
      if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
      }
  });
};
