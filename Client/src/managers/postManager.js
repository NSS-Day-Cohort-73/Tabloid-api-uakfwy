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
