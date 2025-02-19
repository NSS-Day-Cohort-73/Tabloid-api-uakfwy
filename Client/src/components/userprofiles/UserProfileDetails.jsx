import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  demoteUser,
  getProfile,
  promoteUser,
} from "../../managers/userProfileManager";
import { Button } from "reactstrap";

export default function UserProfileDetails({ loggedInUser }) {
  const [userProfile, setUserProfile] = useState();

  const { id } = useParams();

  useEffect(() => {
    getProfile(id).then(setUserProfile);
  }, [id]);

  const handleUpdateUserRole = (userProfile) => {
    if (userProfile.roles?.includes("Admin")) {
      demoteUser(userProfile.identityUserId)
        .then(() => getProfile(id))
        .then(setUserProfile);
    } else {
      promoteUser(userProfile.identityUserId)
        .then(() => getProfile(id))
        .then(setUserProfile);
    }
  };

  const renderPromoteDemoteButton = () => {
    if (
      loggedInUser.id !== parseInt(id) &&
      loggedInUser.roles?.includes("Admin")
    ) {
      if (userProfile.roles?.includes("Admin")) {
        return (
          <Button
            className="my-post-delete"
            onClick={() => handleUpdateUserRole(userProfile)}
          >
            Demote
          </Button>
        );
      } else {
        return (
          <Button
            className="my-post-edit"
            onClick={() => handleUpdateUserRole(userProfile)}
          >
            Promote
          </Button>
        );
      }
    }
  };

  if (!userProfile) {
    return null;
  }
  return (
    <>
      <div className="d-flex justify-content-center">
        <div
          className="text-center container mt-4 pb-5 border rounded bg-light shadow"
          style={{ maxWidth: "600px" }}
        >
          <img
            className="mx-auto mt-4 rounded"
            src={userProfile.imageLocation}
            alt={userProfile.firstName}
          />
          <h3
            className="mt-3"
            style={{
              color: "#5bb8a6",
            }}
          >
            {userProfile.fullName}
          </h3>
          <div className="mt-3">
            <div className="p-3">
              <p className="mb-2">
                <span className="fw-semibold text-secondary">Username:</span>{" "}
                {userProfile.userName}
              </p>
              <p className="mb-2">
                <span className="fw-semibold text-secondary">Email:</span>{" "}
                {userProfile.email}
              </p>
              <p className="mb-2">
                <span className="fw-semibold text-secondary">Created:</span>{" "}
                {new Date(userProfile.createDateTime).toLocaleDateString()}
              </p>
              <p>
                <span
                  className="badge"
                  style={{
                    backgroundColor: "#5bb8a6",
                    color: "white",
                  }}
                >
                  {userProfile.roles[0] ? userProfile.roles : "USER"}
                </span>
              </p>
            </div>
            {renderPromoteDemoteButton()}
          </div>
        </div>
      </div>
    </>
  );
}
