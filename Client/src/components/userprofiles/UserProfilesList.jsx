import { useEffect, useState } from "react";
import { getProfiles } from "../../managers/userProfileManager";
import { Link } from "react-router-dom";
import "../../styles/userProfile.css";

export default function UserProfileList() {
  const [userprofiles, setUserProfiles] = useState([]);

  const getUserProfiles = () => {
    getProfiles().then(setUserProfiles);
  };
  useEffect(() => {
    getUserProfiles();
  }, []);
  return (
    <>
      <div className="d-flex justify-content-center">
        <div
          className="text-center container mt-4 pb-5 border rounded bg-light shadow"
          style={{ maxWidth: "800px" }}
        >
          <h2 className="mt-4 mb-4">User Profile List</h2>
          <div className="m-auto justify-content-center px-4">
            {userprofiles.map((p) => (
              <div
                key={p.id}
                className="border rounded p-4 mx-auto mb-3 hover:bg-gray-50 transition-all"
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <span className="fw-semibold">{p.fullName}</span>
                    {p.roles[0] && (
                      <span
                        className="badge ms-2"
                        style={{
                          backgroundColor: "#5bb8a6",
                          color: "white",
                        }}
                      >
                        ADMIN
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/userprofiles/${p.id}`}
                    className="btn btn-sm btn-custom-green"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
