const apiString = "/api/post";

// Get all posts. Can include optional Count parameter to limit number of posts received,
// or an optional userId parameter to get all posts by a certain user
// or an optional tagId to filter posts by a tag
// All parameters expect a positive integer
export const getAllPosts = async (
  count = null,
  userId = null,
  tagId = null
) => {
  try {
    const params = new URLSearchParams();

    if (count !== null && count > 0) {
      params.append("count", count);
    }
    if (userId !== null && userId > 0) {
      params.append("userId", userId);
    }
    if (tagId !== null && tagId > 0) {
      params.append("tagId", tagId);
    }

    const url = params.toString()
      ? `${apiString}?${params.toString()}`
      : apiString;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return null;
  }
};

export const getPostById = async (postId) => {
  const response = await fetch(`${apiString}/${postId}`);

  if (!response.ok) {
    throw new Error(`HTTP error! Status ${response.status}`);
  }
  return response.json();
};

//Creates a new post
//userId is a required query parameter associating a post with the logged in user
export const addNewPost = async (userId, postObj) => {
  const response = await fetch(`${apiString}?userId=${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postObj),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status${response.status}`);
  }
  return response.json();
};

//Deletes a post specified by the postId
export const deletePost = async (postId) => {
  const response = await fetch(`${apiString}/${postId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`HTTP Error! Status ${response.status}`);
  }
};

//Updates an existing Post
//Expects the Updated Post Object
export const updatePost = async (postObj) => {
  const response = await fetch(`${apiString}/${postObj.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postObj),
  });
  if (!response.ok) {
    throw new Error(`HTTP Error! Status ${response.status}`);
  }
};

//Gets all posts from all authors that a user is subscribed too
//Expects the Id of the logged in user
export const postsFromSubscription = async (userId) => {
  const response = await fetch(`${apiString}/${userId}/subscribed`);

  if (!response.ok) {
    throw new Error(`HTTP Error! Status${response.status}`);
  }
  return response.json();
};

export const getAllPostsWithApprovalStatus = async () => {
  try {
    const response = await fetch(`${apiString}/allApprovalStatuses`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching posts with approval status:", error);
    return null;
  }
};

export const togglePostApproval = async (id) => {
  try {
    const response = await fetch(`${apiString}/${id}/approval`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error toggling post approval:", error);
    return null;
  }
};
