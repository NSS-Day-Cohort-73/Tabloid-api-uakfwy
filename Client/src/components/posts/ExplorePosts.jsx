import { useEffect, useState } from "react";
import {
  deletePost,
  getAllPosts,
  getPostsByCategoryId,
  getTagCatFilteredPosts,
} from "../../managers/postManager";
import { getTags } from "../../managers/tagManager";
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
import { useNavigate } from "react-router-dom";
import "../../styles/tags.css";
import "../../styles/posts.css";
import CategoryDropdownFilter from "../category/CategoryDropdownFilter";
export const ExplorePosts = ({ loggedInUser }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [modal, setModal] = useState(false);
  const [modalTarget, setModalTarget] = useState({});

  const navigate = useNavigate();

  const toggle = () => setModal(!modal);

  useEffect(() => {
    getAllPosts().then(setAllPosts);
    getAllPosts().then(setFilteredPosts);
    getTags().then(setTags);
  }, []);

  const handleReadTimeCalc = (body) => {
    if (!body) return "0 minutes";

    const wordCount = body.split(/\s+/).length;

    const readTimeMinutes = Math.ceil(wordCount / 265);

    return readTimeMinutes === 1 ? "1 minute" : `${readTimeMinutes} minutes`;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      let posts;

      if (selectedCategoryId === 0 && selectedTagId === 0) {
        posts = await getAllPosts();
      } else if (selectedTagId > 0 && selectedCategoryId === 0) {
        posts = await getAllPosts(null, null, selectedTagId);
      } else if (selectedCategoryId > 0 && selectedTagId === 0) {
        posts = await getPostsByCategoryId(selectedCategoryId);
      } else {
        posts = await getTagCatFilteredPosts(
          null,
          selectedTagId,
          selectedCategoryId
        );
      }

      setFilteredPosts(posts);
    };

    fetchPosts();
  }, [selectedCategoryId, selectedTagId]);

  const handleDeletePost = (postId) => {
    deletePost(postId)
      .then(() => getAllPosts())
      .then((posts) => {
        setAllPosts(posts);
        setFilteredPosts(posts);
        return posts;
      });
  };

  return (
    <div className="container mt-5">
      <div className="mb-5">
        <>
          {
            <CategoryDropdownFilter
              setPosts={setFilteredPosts}
              setSelectedCategoryId={setSelectedCategoryId}
              selectedCategoryId={selectedCategoryId}
            />
          }
        </>
      </div>
      <Row className="explore-container">
        <Col className="explore-tags">
          <h4 className="mb-4">Search by Tag</h4>
          <Card
            className={`mb-4 text-center tag-choice ${
              selectedTagId === 0 && "tagChosen"
            }`}
            onClick={() => {
              setSelectedTagId(0);
              getAllPosts().then(setFilteredPosts);
            }}
          >
            <CardBody tag="h4">View All</CardBody>
          </Card>
          {tags.map((t) => (
            <Card
              className={`text-center mb-4 tag-choice ${
                t.id === selectedTagId && "tagChosen"
              }`}
              onClick={() => setSelectedTagId(t.id)}
            >
              <CardBody tag="h4">{t.tagName}</CardBody>
            </Card>
          ))}
        </Col>
        <Col className="explore-posts mt-5">
          {filteredPosts?.map((p) => (
            <Card
              className="text-center mb-5 explore-postCard"
              onClick={() => navigate(`/posts/${p.id}`)}
            >
              {p.imageUrl ? (
                <Col>
                  <img
                    alt={`image for post with the title of ${p.title}`}
                    src={p.imageUrl}
                    className="explore-postCard-img"
                  />
                </Col>
              ) : (
                ""
              )}
              <Col>
                <CardBody>
                  <Row>
                    <Col>
                      <CardTitle tag="h4" className="mb-2">
                        {p.title}
                      </CardTitle>
                      {p.subTitle ? (
                        <CardSubtitle tag="h6" className="text-muted mb-2">
                          {p.subTitle}
                        </CardSubtitle>
                      ) : (
                        ""
                      )}
                      <CardSubtitle
                        tag="h6"
                        className="post-details-category mb-2"
                      >
                        {p.category?.categoryName}
                      </CardSubtitle>
                      <CardText>{`${p.body.slice(0, 100)}...`}</CardText>
                    </Col>
                    <Col>
                      <CardText className="text-muted">
                        {" "}
                        {`Published On: ${p.publishDate?.split("T")[0]}`}
                      </CardText>
                      <CardText className="text-muted">{`Read Time: ${handleReadTimeCalc(
                        p.body
                      )}`}</CardText>
                      {(loggedInUser.roles?.includes("Admin") ||
                        p.userProfileId === parseInt(loggedInUser.id)) && (
                        <Button
                          className="my-post-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalTarget(p);
                            toggle();
                          }}
                        >
                          Delete Post
                        </Button>
                      )}
                    </Col>
                  </Row>
                </CardBody>
              </Col>
            </Card>
          ))}
        </Col>
      </Row>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>
          {`Delete ${modalTarget.title}?`}
        </ModalHeader>
        <ModalBody>Are you sure you want to delete this post?</ModalBody>
        <ModalFooter>
          <Button
            className="my-post-delete"
            onClick={() => {
              handleDeletePost(modalTarget.id);
              toggle();
            }}
          >
            Delete
          </Button>
          <Button className="my-post-edit" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
