import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllPostsWithApprovalStatus,
  togglePostApproval,
} from "../../managers/postManager";
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
import { getAllCategories } from "../../managers/categoryManager";

export default function ManagePosts() {
  const [userPosts, setUserPosts] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [modalTarget, setModalTarget] = useState({});
  const [categories, setCategories] = useState([]);

  const deleteToggle = () => setDeleteModal(!deleteModal);

  const navigate = useNavigate();

  const handleApprovalStatus = (postId) => {
    togglePostApproval(postId).then(() => {
      getAllPostsWithApprovalStatus().then(setUserPosts);
    });
  };

  useEffect(() => {
    getAllPostsWithApprovalStatus().then(setUserPosts);
    getAllCategories().then(setCategories);
  }, []);

  const handleReadTimeCalc = (body) => {
    if (!body) return "0 minutes";

    const wordCount = body.split(/\s+/).length;

    const readTimeMinutes = Math.ceil(wordCount / 265);

    return readTimeMinutes === 1 ? "1 minute" : `${readTimeMinutes} minutes`;
  };

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
                      <CardText className="text-muted">{`Read Time: ${handleReadTimeCalc(
                        p?.body
                      )}`}</CardText>
                    </Col>
                  </Row>
                  <CardText>{`${p.body.slice(0, 200)}...`}</CardText>
                  {p.imageUrl && (
                    <div>
                      <Button
                        className="my-post-delete-img-manage"
                        style={
                          p.approved
                            ? { backgroundColor: "#5bb8a6" }
                            : { backgroundColor: "#db534b" }
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteToggle();
                          setModalTarget({
                            id: p.id,
                            title: p.title,
                            approved: p.approved,
                          });
                        }}
                      >
                        {p.approved ? "Approved" : "Unapproved"}
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Col>
            </Row>
            {!p.imageUrl && (
              <Row className="d-flex justify-content-around">
                <Col className="d-flex justify-content-around"></Col>
                <Col className="d-flex justify-content-around">
                  <Button
                    className="btn my-post-delete-manage mb-2"
                    style={
                      p.approved
                        ? { backgroundColor: "#5bb8a6" }
                        : { backgroundColor: "#db534b" }
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteToggle();
                      setModalTarget({
                        id: p.id,
                        title: p.title,
                        approved: p.approved,
                      });
                    }}
                  >
                    {p.approved ? "Approved" : "Unapproved"}
                  </Button>
                </Col>
              </Row>
            )}
          </Card>
        ))}
      </div>
      <Modal isOpen={deleteModal} toggle={deleteToggle}>
        <ModalHeader toggle={deleteToggle}>
          {`${modalTarget.approved ? "Un-approve" : "Approve"} ${
            modalTarget.title
          }?`}
        </ModalHeader>
        <ModalBody>
          Are you sure you want to{" "}
          {modalTarget.approved ? "un-approve" : "approve"} this post?
        </ModalBody>
        <ModalFooter>
          <Button
            className="my-post-edit btn"
            onClick={() => {
              handleApprovalStatus(modalTarget.id);
              deleteToggle();
            }}
          >
            Yes
          </Button>
          <Button className="my-post-delete btn" onClick={deleteToggle}>
            No
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
