import { useEffect, useState } from "react";
import { getAllPosts } from "../../managers/postManager";
import { getTags } from "../../managers/tagManager";
import {
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
  Col,
  Row,
} from "reactstrap";
export const ExplorePosts = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getAllPosts().then(setAllPosts);
    getTags().then(setTags);
  }, []);
  return (
    <div className="container">
      <Row className="d-flex justify-content-around">
        <Col>
          <h4>Search by Tag</h4>
          {tags.map((t) => (
            <Card className="text-center mb-4" style={{ width: "20%" }}>
              <CardBody tag="h4">{t.tagName}</CardBody>
            </Card>
          ))}
        </Col>
        <Col>
          {allPosts.map((p) => (
            <Card className="text-center">
              <CardBody>
                <Row>
                  {p.imageUrl ? (
                    <Col>
                      <img
                        alt={`image for post with the title of ${p.title}`}
                        src={p.imageUrl}
                        className="img-fluid"
                      />
                    </Col>
                  ) : (
                    ""
                  )}
                  <Col>
                    <CardTitle tag="h4">{p.title}</CardTitle>
                    {p.subTitle ? (
                      <CardSubtitle tag="h6" className="text-muted">
                        {p.subTitle}
                      </CardSubtitle>
                    ) : (
                      ""
                    )}
                    <CardSubtitle tag="h6">
                      {p.category?.categoryName}
                    </CardSubtitle>
                    <CardText>{`${p.body.slice(0, 100)}...`}</CardText>
                  </Col>
                  <Col>
                    <CardText className="text-muted">
                      {" "}
                      {`Published On: ${p.publishDate?.split("T")[0]}`}
                    </CardText>
                    <CardText className="text-muted">{`Read Time: `}</CardText>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          ))}
        </Col>
      </Row>
    </div>
  );
};
