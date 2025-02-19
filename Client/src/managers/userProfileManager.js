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

export const demoteUser = async (identityUserId) => {
  const response = await fetch(`${_apiUrl}/demote/${identityUserId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP Error! Status ${response.status}`);
  }
};

export const adminActions
