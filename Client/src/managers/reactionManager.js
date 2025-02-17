const apiString = "/api/reaction";

//Get all available reactions to render onto page
export const getAllReactions = async () => {
  const response = await fetch(apiString);

  if (!response.ok) {
    throw new Error(`HTTP error! Status ${response.status}`);
  }
  return response.json();
};

//Post a new PostReaction for when a user reacts to a post
export const newReaction = async (reaction) => {
  const response = await fetch("/api/postreaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reaction),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status ${response.status}`);
  }

  return response.json();
};

//Delete a PostReaction entity allowing a user to un-react to a post
export const removeReaction = async (postReactionId) => {
  const response = await fetch(`/api/postreaction/${postReactionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! Status ${response.status}`);
  }
};

export const postANewReaction = async (reaction) => {
  const response = await fetch("/api/reaction", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reaction),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status ${response.status}`);
  }

  return response.json();
};
