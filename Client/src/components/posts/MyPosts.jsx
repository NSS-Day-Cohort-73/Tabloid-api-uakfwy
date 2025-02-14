import { useEffect, useRef, useState } from "react";
import {
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../../managers/postManager";
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import "../../styles/posts.css";
import { useNavigate } from "react-router-dom";
import { getAllCategories } from "../../managers/categoryManager";
import { AutoResizeTextarea } from "../AutoResizeTextarea";

export const MyPosts = ({ loggedInUser }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [modalTarget, setModalTarget] = useState({});
  const [postToEdit, setPostToEdit] = useState({
    id: 0,
    title: "",
    subTitle: "",
    body: "",
  });
  const [categories, setCategories] = useState([]);

  const deleteToggle = () => setDeleteModal(!deleteModal);
  const editToggle = () => setEditModal(!editModal);

  const navigate = useNavigate();

  const handleDelete = (postId) => {
    deletePost(postId).then(() => {
      getAllPosts(null, loggedInUser.id, null).then(setUserPosts);
    });
  };

  const handleGetPostToEdit = (postId) => {
    getPostById(postId).then(setPostToEdit);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostToEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedPost = {
      id: postToEdit.id,
      title: postToEdit.title,
      subTitle: postToEdit.subTitle,
      categoryId: parseInt(postToEdit.categoryId),
      body: postToEdit.body,
    };
    updatePost(updatedPost).then(() => navigate(`/posts/${postToEdit.id}`));
  };

  useEffect(() => {
    getAllPosts((null, loggedInUser.id, null)).then(setUserPosts);
    getAllCategories().then(setCategories);
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
                          editToggle();
                          setModalTarget({ id: p.id });
                          handleGetPostToEdit(p.id);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        className="my-post-delete my-post-delete-img"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteToggle();
                          setModalTarget({
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
                      editToggle();
                      setModalTarget({ id: p.id });
                      handleGetPostToEdit(p.id);
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
                      deleteToggle();
                      setModalTarget({ id: p.id, title: p.title });
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
      <Modal isOpen={deleteModal} toggle={deleteToggle}>
        <ModalHeader toggle={deleteToggle}>
          {`Delete ${modalTarget.title}?`}
        </ModalHeader>
        <ModalBody>Are you sure you want to delete this post?</ModalBody>
        <ModalFooter>
          <Button
            className="my-post-delete btn"
            onClick={() => {
              handleDelete(modalTarget.id);
              deleteToggle();
            }}
          >
            Delete
          </Button>
          <Button className="my-post-edit btn" onClick={deleteToggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={editModal} toggle={editToggle} fullscreen>
        <ModalHeader toggle={editToggle}>
          {`Editing ${postToEdit.title}`}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="editPost-title">Title</Label>
              <Input
                id="editPost-title"
                type="text"
                name="title"
                value={postToEdit.title}
                onChange={(e) => handleInputChange(e)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="editPost-subTitle">Sub-Title</Label>
              <Input
                id="editPost-subtitle"
                type="text"
                name="subTitle"
                value={postToEdit.subTitle}
                onChange={(e) => handleInputChange(e)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="editPost-category">Category</Label>
              <Input
                id="editPost-category"
                type="select"
                name="categoryId"
                value={postToEdit.categoryId}
                onChange={(e) => handleInputChange(e)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.categoryName}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="editPost-body">Body</Label>
              <AutoResizeTextarea
                id="editPost-body"
                className="flex-grow-1"
                name="body"
                value={postToEdit.body}
                onChange={(e) => handleInputChange(e)}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            className="btn my-post-edit edit-saveChanges"
            onClick={(e) => handleUpdate(e)}
          >
            Save Changes
          </Button>
          <Button
            className="btn  my-post-delete edit-cancel"
            onClick={editToggle}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
