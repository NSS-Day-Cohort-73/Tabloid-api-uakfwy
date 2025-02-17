import { useState } from "react";
import { postsFromSubscription } from "../../managers/postManager";
import {
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Row,
} from "reactstrap";
import "../../styles/posts.css";
import { useNavigate } from "react-router-dom";
import { getProfilesWithCount } from "../../managers/userProfileManager";

export const HomePosts = ({ loggedInUser }) => {
  const [posts, setPosts] = useState([]);
  const [newAuthors, setNewAuthors] = useState([]);

  const navigate = useNavigate();

  useState(() => {
    postsFromSubscription(loggedInUser.id).then(setPosts);
    getProfilesWithCount(5).then(setNewAuthors);
  }, [loggedInUser]);

  return (
    <div className="container">
      <div className="header mt-4">
        <Row className="d-flex">
          <Col className="d-flex justify-content-start">
            <h2 className="mb-5">Latest Posts</h2>
          </Col>
          <Col className="d-flex justify-content-end">
            <h2>New Authors</h2>
          </Col>
        </Row>
      </div>
      <Row>
        <Col md={9}>
          <div id="postsContainer">
            <Row>
              <Col className="latestPost-container">
                <div className="latestPost">
                  <Card
                    className="postCard"
                    onClick={() => navigate(`/posts/${posts[0].id}`)}
                  >
                    {posts[0]?.imageUrl !== null ? (
                      <img
                        alt={`Image for ${posts[0]?.title}`}
                        src={posts[0]?.imageUrl}
                        className="mb-2"
                      />
                    ) : (
                      ""
                    )}
                    <CardBody>
                      <Row>
                        <Col>
                          <CardTitle tag="h5" className="mb-3">
                            {posts[0]?.title}
                          </CardTitle>
                          {posts[0]?.subTitle ? (
                            <CardSubtitle tag="h6" className="mb-2 text-muted">
                              {posts[0]?.subTitle}
                            </CardSubtitle>
                          ) : (
                            ""
                          )}
                        </Col>
                        <Col>
                          <CardSubtitle
                            tag="h6"
                            className="text-muted mb-4"
                          >{`Author: ${posts[0]?.userProfile?.userName}`}</CardSubtitle>
                          <CardSubtitle tag="h6" className="text-muted mb-4">
                            {`Published: ${
                              posts[0]?.publishDate?.split("T")[0]
                            }`}
                          </CardSubtitle>
                          <CardSubtitle
                            tag="h6"
                            className="text-muted"
                          >{`Read Time: `}</CardSubtitle>
                        </Col>
                      </Row>
                      <CardText>
                        {posts[0]?.body?.length > 100
                          ? `${posts[0]?.body?.slice(0, 200)}...`
                          : posts[0]?.body}
                      </CardText>
                    </CardBody>
                  </Card>
                </div>
              </Col>
              <Col>
                <div className="otherLatestPosts">
                  {posts.slice(1).map((p) => (
                    <Card
                      key={p.id}
                      className="postCard-small mb-5"
                      onClick={() => navigate(`/posts/${p.id}`)}
                    >
                      <Row>
                        <Col>
                          <CardBody>
                            <CardTitle tag="h5">{p.title}</CardTitle>
                            <Row>
                              <Col>
                                {p.subTitle ? (
                                  <CardSubtitle
                                    tag="h6"
                                    className="mb-2 text-muted"
                                  >
                                    {p.subTitle}
                                  </CardSubtitle>
                                ) : (
                                  ""
                                )}
                              </Col>
                              <Col>
                                <CardSubtitle
                                  tag="h6"
                                  className="mb-2 text-muted"
                                >{`Author: ${p.userProfile?.userName}`}</CardSubtitle>
                              </Col>
                            </Row>
                            {p.imageUrl && (
                              <CardText className="mb-3">{`${p.body.slice(
                                0,
                                50
                              )}...`}</CardText>
                            )}
                            <Row>
                              <Col>
                                <CardSubtitle
                                  tag="h6"
                                  className="text-muted"
                                >{`Published: ${
                                  p.publishDate.split("T")[0]
                                }`}</CardSubtitle>
                              </Col>
                              <Col>{`Read Time: `}</Col>
                            </Row>
                            {!p.imageUrl && (
                              <CardText className="mb-3">{`${p.body.slice(
                                0,
                                100
                              )}...`}</CardText>
                            )}
                          </CardBody>
                        </Col>
                        {p.imageUrl && (
                          <Col>
                            <img
                              alt={`Image for the post ${p.title}`}
                              src={p.imageUrl}
                              className="img-fluid"
                            />
                          </Col>
                        )}
                      </Row>
                    </Card>
                  ))}
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={3}>
          <div id="newAuthorsContainer">
            {newAuthors.map((a) => (
              <Card key={a.id} className="mb-3">
                <CardBody>
                  <Row className="d-flex">
                    <Col className="d-flex align-items-center">
                      <img
                        alt={`${a.identityUser?.userName} profile picture`}
                        src={a.imageLocation}
                        className="img-fluid"
                      ></img>
                    </Col>
                    <Col className="d-flex align-items-center">
                      <CardText>{a.identityUser?.userName}</CardText>
                    </Col>
                    <Col className="d-flex align-items-center">
                      <CardText>{`Joined on: ${
                        a.createDateTime?.split("T")[0]
                      }`}</CardText>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};
