const apiString = "/api/posttag";

//Creates a new relationship between a post and a tag
//Expects an object with a tagId and a postId
export const newPostTag = async (postTag) => {
  const response = await fetch(apiString, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postTag),
  });
  if (!response.ok) {
    throw new Error(`HTTP Error! Status ${response.status}`);
  }
  return response.json();
};

//Deletes an existing relationship between a tag and a post
//Expects an object with a tagId and a postId
export const deletePostTag = async (postTag) => {
  const response = await fetch(apiString, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP Error! Status ${response.status}`);
  }
};
