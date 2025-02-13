import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import "../../styles/posts.css";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../managers/categoryManager";
import { useNavigate } from "react-router-dom";
import { addNewPost } from "../../managers/postManager";

export const NewPost = ({ loggedInUser }) => {
  const [categories, setCategories] = useState([]);
  const [newPost, setNewPost] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    getAllCategories().then(setCategories);
  }, [categories.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    const newPostDetails = {
      ...newPost,
      categoryId: parseInt(newPost.categoryId),
      imageUrl: null,
    };
    addNewPost(loggedInUser.id, newPostDetails).then((response) =>
      navigate(`/posts/${response.id}`)
    );
  };

  return (
    <div className="container">
      <Form className="new-post-container mt-5">
        <h2 className="text-center mb-5">Create A Post</h2>
        <FormGroup>
          <Row>
            <Col md={2} className="mb-3">
              <Label for="new-post-title">Title</Label>
            </Col>
            <Col md={10}>
              <Input
                id="new-post-title"
                className="post-input"
                type="text"
                name="title"
                required
                placeholder="Enter title"
                onChange={(e) => handleInputChange(e)}
              />
            </Col>
          </Row>
        </FormGroup>
        <FormGroup>
          <Row>
            <Col md={2} className="mb-3">
              <Label for="new-post-subTitle">Sub-Title</Label>
            </Col>
            <Col md={10}>
              <Input
                id="new-post-subTitle"
                className="post-input"
                type="text"
                name="subTitle"
                placeholder="Enter sub-title"
                onChange={(e) => handleInputChange(e)}
              />
            </Col>
          </Row>
        </FormGroup>
        <FormGroup>
          <Row>
            <Col md={2} className="mb-3">
              <Label for="new-post-category">Category</Label>
            </Col>
            <Col md={10}>
              <Input
                id="new-post-category"
                className="post-input"
                type="select"
                name="categoryId"
                required
                onChange={(e) => handleInputChange(e)}
              >
                <option value="">Select a category...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.categoryName}
                  </option>
                ))}
              </Input>
            </Col>
          </Row>
        </FormGroup>
        <FormGroup>
          <Row>
            <Col md={2}>
              <Label for="new-post-body">Body</Label>
            </Col>
            <Col md={10}>
              <Input
                id="new-post-body"
                className="post-input"
                type="textarea"
                name="body"
                placeholder="What do you want to say?"
                onChange={(e) => handleInputChange(e)}
              />
            </Col>
          </Row>
        </FormGroup>
        <FormGroup>
          <Button
            className="mt-5"
            color="dark"
            onClick={(e) => handleCreatePost(e)}
          >
            Submit
          </Button>
        </FormGroup>
      </Form>
    </div>
  );
};
