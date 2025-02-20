const _apiUrl = "/api/userprofile";

export const getProfiles = () => {
  return fetch(_apiUrl + "/withroles").then((res) => res.json());
};

export const getProfile = (id) => {
  return fetch(_apiUrl + `/${id}`).then((res) => res.json());
};

export const getProfilesWithCount = async (profileCount) => {
  const response = await fetch(`${_apiUrl}?authorCount=${profileCount}`);
  if (!response.ok) {
    throw new Error(`HTTP Error! Status${response.status}`);
  }
  return response.json();
};

//Promotes a UserProfile from an Author to an Admin
//Expects the IdentityUser GUID format Id
export const promoteUser = async (identityUserId) => {
  const response = await fetch(`${_apiUrl}/promote/${identityUserId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP Error! Status ${response.status}`);
  }
};

//Gets Pending Actions for a target User
//Expects a UserId
export const getUserPendingAction = async (userId) => {
  const response = await fetch(`${_apiUrl}/pending/${userId}`);

  if (!response.ok) {
    throw new Error(`HTTP Error! Status ${response.status}`);
  }

  if (response.status === 404) {
    return null;
  }
  const data = response.json();
  // if (!data || Object.keys(data).length === 0) {
  //   return null;
  // }

  return data;
};

//Initializes an Admin Action to demote a user.
//Expects the Identity User Id of the user being demoted, as well as the UserId of the user initializing the action
export const initializeDemote = async (identityUserId, currentUserId) => {
  const response = await fetch(
    `${_apiUrl}/demote/${identityUserId}?currentUserId=${currentUserId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP Error! Status ${response.status}`);
  }

  return response.json();
};

//Creates a new vote on an existing Demote Action.
//Expects the Id of the action that is being voted on, as well as the UserId of the user placing the vote
export const voteToDemote = async (actionId, currentUserId) => {
  const response = await fetch(
    `${_apiUrl}/demote/vote/${actionId}?currentUserId=${currentUserId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    let errorMessage = `HTTP Error! Status ${response.status}`;

    try {
      const errorData = await response.text();
      errorMessage = errorData || errorMessage;
    } catch (error) {
      console.error("Failed to parse error response", error);
    }
    return { error: errorMessage };
  }
  if (response.status === 204) {
    return { message: "User has been demoted" };
  }

  return response.json();
};

export const deactivateUser = async (id) => {
  const response = await fetch(`${_apiUrl}/deactivate/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Failed to deactivate user. Status: ${response.status}`);
  }
};

export const reactivateUser = async (id) => {
  const response = await fetch(`${_apiUrl}/reactivate/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Failed to reactivate user. Status: ${response.status}`);
  }
};
