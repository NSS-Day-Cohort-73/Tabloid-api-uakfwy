import { useEffect, useState } from "react";
import { deletePost, getAllPosts } from "../../managers/postManager";
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import "../../styles/posts.css";
import { useNavigate } from "react-router-dom";

export const MyPosts = ({ loggedInUser }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [modal, setModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({});

  const toggle = () => setModal(!modal);

  const navigate = useNavigate();

  const handleDelete = (postId) => {
    deletePost(postId).then(() => {
      getAllPosts(null, loggedInUser.id, null).then(setUserPosts);
    });
  };

  useEffect(() => {
    getAllPosts((null, loggedInUser.id, null)).then(setUserPosts);
  }, [loggedInUser]);
  return (
    <div className="container">
      <h2 className="text-center mt-5 mb-5">My Posts</h2>
      <div className="my-posts-container">
        {userPosts.map((p) => (
          <Card
            key={p.id}
            className="mb-4 my-posts-card"
            onClick={() => navigate(`/posts/${p.id}`)}
          >
            <Row>
              {p.imageUrl && (
                <Col>
                  <img
                    alt={`Picture for the post ${p.title}`}
                    src={p.imageUrl}
                    className="img-fluid"
                  />
                </Col>
              )}
              <Col>
                <CardBody className="mb-3">
                  <Row>
                    <Col>
                      <CardTitle tag="h5" className="mb-3">
                        {p.title}
                      </CardTitle>
                      {p.subTitle && (
                        <CardSubtitle className="text-muted mb-3" tag="h6">
                          {p.subTitle}
                        </CardSubtitle>
                      )}
                      <CardSubtitle
                        tag="h6"
                        className="mb-3 post-details-category"
                      >
                        {p.category?.categoryName}
                      </CardSubtitle>
                    </Col>
                    <Col>
                      <CardText className="text-muted">{`Published On: ${
                        p.publishDate.split("T")[0]
                      }`}</CardText>
                      <CardText className="text-muted">{`Read Time:`}</CardText>
                    </Col>
                  </Row>
                  <CardText>{`${p.body.slice(0, 200)}...`}</CardText>
                  {p.imageUrl && (
                    <div>
                      <Button
                        className="my-post-edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/posts/${p.id}/edit`);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        className="my-post-delete my-post-delete-img"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle();
                          setDeleteTarget({
                            id: p.id,
                            title: p.title,
                          });
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Col>
            </Row>
            {!p.imageUrl && (
              <Row className="d-flex justify-content-around">
                <Col className="d-flex justify-content-around">
                  <Button
                    className="btn my-post-edit mb-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/posts/${p.id}/edit`);
                    }}
                  >
                    Edit
                  </Button>
                </Col>
                <Col className="d-flex justify-content-around">
                  <Button
                    className="btn my-post-delete mb-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle();
                      setDeleteTarget({ id: p.id, title: p.title });
                    }}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
            )}
          </Card>
        ))}
      </div>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader
          toggle={toggle}
        >{`Delete ${deleteTarget.title}?`}</ModalHeader>
        <ModalBody>Are you sure you want to delete this post?</ModalBody>
        <ModalFooter>
          <Button
            className="my-post-delete btn"
            onClick={() => {
              handleDelete(deleteTarget.id);
              toggle();
            }}
          >
            Delete
          </Button>
          <Button className="my-post-edit btn" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
