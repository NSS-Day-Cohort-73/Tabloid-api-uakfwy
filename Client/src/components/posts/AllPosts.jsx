import { useState } from "react";
import { getAllPosts } from "../../managers/postManager";
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

export const AllPosts = () => {
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  useState(() => {
    getAllPosts().then(setPosts);
  }, []);
  return (
    <div className="container">
      <div className="header mt-4">
        <h2 className="mb-5">Latest Posts</h2>
      </div>
      <Row>
        <Col md={10}>
          <div id="postsContainer">
            <Row>
              <Col>
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
                      className="postCard-small"
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
                            <CardText className="mb-3">{`${p.body.slice(
                              0,
                              100
                            )}...`}</CardText>
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
                          </CardBody>
                        </Col>
                        <Col>
                          <img
                            alt={`Image for the post ${p.title}`}
                            src={p.imageUrl}
                            className="img-fluid"
                          />
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={2}>
          <div id="newAuthorsContainer">
            <div id="newAuthorsHeader">
              <h4>New Authors</h4>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
