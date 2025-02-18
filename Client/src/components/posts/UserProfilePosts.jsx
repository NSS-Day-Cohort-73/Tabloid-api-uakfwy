import { useEffect, useState } from "react";
import { getAllPosts } from "../../managers/postManager";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Row,
} from "reactstrap";
import "../../styles/userProfile.css";
import {
  createSubscription,
  deleteSubscription,
  getSubscriptionStatus,
} from "../../managers/subscriptionManager";

export const UserProfilePosts = ({ loggedInUser }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState(false);

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    getAllPosts(null, id, null).then(setUserPosts);
  }, [id]);

  useEffect(() => {
    getSubscriptionStatus(loggedInUser.id, id).then((response) =>
      setSubscriptionStatus(!!response)
    );
  }, [id]);

  const handleSubscribeBtn = () => {
    if (subscriptionStatus === false) {
      const subscriptionObj = {
        authorId: id,
        subscriberId: loggedInUser.id,
      };

      createSubscription(subscriptionObj).then(() => {
        getSubscriptionStatus(loggedInUser.id, id).then((response) =>
          setSubscriptionStatus(!!response)
        );
      });
    } else {
      deleteSubscription(loggedInUser.id).then(() => {
        getSubscriptionStatus(loggedInUser.id, id).then((response) =>
          setSubscriptionStatus(!!response)
        );
      });
    }
  };

  return (
    <div className="container">
      <div className="userPosts-header">
        <Row className="d-flex">
          <Col md={2} className="d-flex justify-content-end align-items-center">
            {
              <img
                alt={`${userPosts[0]?.userProfile?.userName} profile picture`}
                src={userPosts[0]?.userProfile?.imageLocation}
              />
            }
          </Col>
          <Col
            md={8}
            className="d-flex justify-content-start align-items-center"
          >
            <h2>{userPosts[0]?.userProfile?.userName}</h2>
          </Col>
          <Col
            md={2}
            className="d-flex justify-content-start align-items-center"
          >
            {loggedInUser.id != id ? (
              <Button
                onClick={handleSubscribeBtn}
                className="border rounded shadow-sm btn"
                style={
                  subscriptionStatus === true
                    ? {
                        backgroundColor: "white",
                        color: "#db534b",
                        borderColor: "#ffa500",
                        height: "30%",
                        width: "10rem",
                      }
                    : {
                        backgroundColor: "#db534b",
                        color: "white",
                        height: "30%",
                        width: "10rem",
                      }
                }
              >
                {subscriptionStatus === false ? "Subscribe" : "Unsubscribe"}
              </Button>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </div>
      <Row className="mt-5 userPosts-container justify-content-center">
        {userPosts.map((p) => (
          <Col key={p.id} xs="12" sm="6" md="4" lg="3">
            <Card
              className="mb-3 postCard-hover"
              onClick={() => navigate(`/posts/${p.id}`)}
            >
              {p.imageUrl && (
                <img
                  className="img-fluid post-image"
                  alt={`image for ${p.title}`}
                  src={p.imageUrl}
                />
              )}
              <CardBody>
                <CardTitle tag="h4" className="mb-3">
                  {p.title}
                </CardTitle>
                {p.subTitle && (
                  <CardSubtitle tag="h6" className="text-muted mb-3">
                    {p.subTitle}
                  </CardSubtitle>
                )}
                <CardSubtitle tag="h6" className="mb-3 post-details-category">
                  {p.category?.categoryName}
                </CardSubtitle>
                <CardText>{`${p.body?.slice(0, 100)}...`}</CardText>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
