import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import "../../styles/posts.css";
import { useEffect, useState } from "react";
import { getAllCategories } from "../../managers/categoryManager";

export const NewPost = ({ loggedInUser }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getAllCategories().then(setCategories);
  }, [categories.length]);
  return (
    <div className="container">
      <Form className="new-post-container mt-5">
        <h2 className="text-center mb-5">Create A Post</h2>
        <FormGroup>
          <Row>
            <Col md={2} className="d-flex justify-content-center">
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
              />
            </Col>
          </Row>
        </FormGroup>
        <FormGroup>
          <Row>
            <Col md={2}>
              <Label for="new-post-subTitle">Sub-Title</Label>
            </Col>
            <Col md={10}>
              <Input
                id="new-post-subTitle"
                className="post-input"
                type="text"
                name="sub-title"
                placeholder="Enter sub-title"
              />
            </Col>
          </Row>
        </FormGroup>
        <FormGroup>
          <Row>
            <Col md={2}>
              <Label for="new-post-category">Category</Label>
            </Col>
            <Col md={10}>
              <Input
                id="new-post-category"
                className="post-input"
                type="select"
                name="category"
                required
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
              />
            </Col>
          </Row>
        </FormGroup>
        <FormGroup>
          <Button className="mt-5">Submit</Button>
        </FormGroup>
      </Form>
    </div>
  );
};
