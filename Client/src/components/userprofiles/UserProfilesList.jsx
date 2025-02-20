import { useEffect, useState } from "react";
import {
  getProfiles,
  deactivateUser,
  reactivateUser,
} from "../../managers/userProfileManager";
import { Link } from "react-router-dom";
import "../../styles/userProfile.css";

export default function UserProfilesList() {
  const [userProfiles, setUserProfiles] = useState([]);
  const [showDeactivated, setShowDeactivated] = useState(false);

  const loadProfiles = () => {
    getProfiles().then(setUserProfiles);
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleDeactivate = (id) => {
    if (window.confirm("Are you sure you want to deactivate this user?")) {
      deactivateUser(id).then(loadProfiles);
    }
  };

  const handleReactivate = (id) => {
    reactivateUser(id).then(loadProfiles);
  };

  return (
    <div className="d-flex justify-content-center">
      <div
        className="text-center container mt-4 pb-5 border rounded bg-light shadow"
        style={{ maxWidth: "800px" }}
      >
        <h2 className="mt-4 mb-4">User Profile List</h2>
        <button
          className="btn btn-sm btn-secondary mb-3"
          onClick={() => setShowDeactivated(!showDeactivated)}
        >
          {showDeactivated ? "View Active Users" : "View Deactivated Users"}
        </button>
        <div className="mt-4 justify-content-center px-4">
          {userProfiles
            .filter((p) => p.isActive !== showDeactivated)
            .map((p) => (
              <div
                key={p.id}
                className="border p-4 mx-auto mb-3 hover:bg-gray-50 transition-all"
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-semibold">{p.fullName}</span>
                  {p.roles[0] && (
                    <span
                      className="badge ms-2"
                      style={{ backgroundColor: "#5bb8a6", color: "white" }}
                    >
                      ADMIN
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <Link
                    to={`/userprofiles/${p.id}`}
                    className="btn btn-sm btn-custom-green"
                  >
                    View Details
                  </Link>
                  {p.isActive ? (
                    <button
                      className="btn btn-sm btn-danger ms-2"
                      onClick={() => handleDeactivate(p.id)}
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-success ms-2"
                      onClick={() => handleReactivate(p.id)}
                    >
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
