import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProfile } from "../../managers/userProfileManager";

export default function UserProfileDetails() {
  const [userProfile, setUserProfile] = useState();

  const { id } = useParams();

  useEffect(() => {
    getProfile(id).then(setUserProfile);
  }, [id]);

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
          <h3 className="mt-3 text-primary">{userProfile.fullName}</h3>
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
                {userProfile.roles ? (
                  <span className="badge bg-primary">ADMIN</span>
                ) : (
                  <span className="badge bg-secondary">USER</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
