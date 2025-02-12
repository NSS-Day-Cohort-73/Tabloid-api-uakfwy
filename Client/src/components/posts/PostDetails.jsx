import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../../managers/postManager";
import "../../styles/posts.css";
import { Col, Row } from "reactstrap";

export const PostDetails = () => {
  const [post, setPost] = useState({});

  const { id } = useParams();

  useEffect(() => {
    getPostById(id).then(setPost);
  }, []);

  return (
    <div className="container">
      <div className="post-details-header">
        <img
          alt={`Image for the post named ${post.title}`}
          src={post.imageUrl}
          className="post-header-image mb-2"
        />
      </div>
      <div className="post-details-card-header">
        <h4 className="post-details-title">{post.title}</h4>
        <h6 className="post-details-category">{post.category?.categoryName}</h6>
      </div>
      <div className="post-details-info">
        <Row className="d-flex justify-content-start w-100">
          <Col className="d-flex align-items-center justify-content-start">
            <img
              alt={`${post.userProfile?.userName} profile picture`}
              src={post.userProfile?.imageLocation}
              className="post-details-author-image"
            />
            <p className="text-muted">{post?.userProfile?.userName}</p>
          </Col>
          <Col className="d-flex align-items-center justify-content-end">
            <p className="text-muted">{post.publishDate?.split("T")[0]}</p>
          </Col>
        </Row>
      </div>
      <div className="post-details-body">{post.body}</div>
      <div className="post-reactions">{}</div>
    </div>
  );
};
