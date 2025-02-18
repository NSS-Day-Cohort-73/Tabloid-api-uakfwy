import { useEffect, useState } from "react";
import { getAllPosts } from "../../managers/postManager";
import { useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import "../../styles/userProfile.css";

export const UserProfilePosts = () => {
  const [userPosts, setUserPosts] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    getAllPosts(null, id, null).then(setUserPosts);
  }, [id]);

  return (
    <div className="container">
      <div className="userPosts-header">
        <Row className="d-flex">
          <Col className="d-flex justify-content-end align-items-center userPosts-image-container">
            {
              <img
                alt={`${userPosts[0]?.userProfile?.userName} profile picture`}
                src={userPosts[0]?.userProfile?.imageLocation}
              />
            }
          </Col>
          <Col className="d-flex justify-content-start align-items-center">
            <h2>{userPosts[0]?.userProfile?.userName}</h2>
          </Col>
        </Row>
      </div>
    </div>
  );
};
