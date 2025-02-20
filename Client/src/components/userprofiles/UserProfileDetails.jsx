import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getProfile,
  getUserPendingAction,
  initializeDemote,
  promoteUser,
  voteToDemote,
} from "../../managers/userProfileManager";
import { Alert, Button } from "reactstrap";

export default function UserProfileDetails({ loggedInUser }) {
  const [userProfile, setUserProfile] = useState();
  const [pendingActions, setPendingActions] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { id } = useParams();

  useEffect(() => {
    getProfile(id).then(setUserProfile);
  }, [id]);

  useEffect(() => {
    const fetchPendingActions = async () => {
      const data = await getUserPendingAction(id);
      console.log("Initial pending actions:", data);
      setPendingActions(data);
    };
    fetchPendingActions();
  }, [id]);

  const handleUpdateUserRole = async (userProfile) => {
    if (userProfile.roles?.includes("Admin")) {
      if (Object.keys(pendingActions).length === 0) {
        await initializeDemote(userProfile.identityUserId, loggedInUser.id);
        const updatedProfile = await getProfile(id);
        setUserProfile(updatedProfile);

        const newPendingAction = await getUserPendingAction(id);
        setPendingActions(newPendingAction);
      } else {
        const voteResponse = await voteToDemote(
          pendingActions.id,
          loggedInUser.id
        );
        if (voteResponse.error) {
          setShowAlert(true);
          setErrorMessage(voteResponse.error);
        }
        const updatedProfile = await getProfile(id);
        setUserProfile(updatedProfile);

        const updatedPendingActions = await getUserPendingAction(id);
        setPendingActions(updatedPendingActions);
      }
    } else {
      promoteUser(userProfile.identityUserId)
        .then(() => getProfile(id))
        .then(setUserProfile)
        .then(() => {
          setPendingActions({});
        });
    }
  };

  const renderPromoteDemoteButton = () => {
    if (
      loggedInUser.id !== parseInt(id) &&
      loggedInUser.roles?.includes("Admin")
    ) {
      if (userProfile.roles?.includes("Admin")) {
        if (Object.keys(pendingActions).length === 0) {
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
              className="my-post-delete"
              onClick={() => handleUpdateUserRole(userProfile)}
            >
              Vote To Demote
            </Button>
          );
        }
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
            {showAlert ? <Alert className="mt-3">{errorMessage}</Alert> : ""}
          </div>
        </div>
      </div>
    </>
  );
}
