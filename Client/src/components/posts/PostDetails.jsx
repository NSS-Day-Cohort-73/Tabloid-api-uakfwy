import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../../managers/postManager";
import "../../styles/posts.css";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import {
  getAllReactions,
  newReaction,
  removeReaction,
} from "../../managers/reactionManager";
import { getTags } from "../../managers/tagManager";
import CommentList from "../comments/CommentList";
import {
  createSubscription,
  deleteSubscription,
  getSubscriptionStatus,
} from "../../managers/subscriptionManager";
import { deletePostTag, newPostTag } from "../../managers/postTagManager";

export const PostDetails = ({ loggedInUser }) => {
  const [post, setPost] = useState({});
  const [reactions, setReactions] = useState([]);
  const [loggedInUserReactions, setLoggedInUserReactions] = useState([]);
  const [postTags, setPostTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [modal, setModal] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(false);

  const { id } = useParams();
  const toggle = () => setModal(!modal);

  useEffect(() => {
    getPostById(id).then(setPost);
    getAllReactions().then(setReactions);
    getTags(id).then(setPostTags);
    getTags().then(setAllTags);
  }, [id]);

  useEffect(() => {
    if (post?.userProfile?.id) {
      getSubscriptionStatus(loggedInUser.id, post.userProfileId).then(
        (response) => setSubscriptionStatus(!!response)
      );
    }
  }, [post]);

  useEffect(() => {
    const reactions = post?.postReactions || [];
    const userReactions = reactions
      .filter((reaction) => reaction.userProfileId === loggedInUser.id)
      .map((reaction) => reaction.reactionId);

    setLoggedInUserReactions(userReactions);
  }, [post, loggedInUser, id]);

  const reactionCount = (reactionId) => {
    const reactions = post?.postReactions || [];
    let count = 0;
    for (let reaction of reactions) {
      if (reaction.reactionId === reactionId) {
        count++;
      }
    }
    return count;
  };

  const handleNewReaction = (clickedReactionId) => {
    const reaction = {
      userProfileId: loggedInUser.id,
      postId: id,
      reactionId: clickedReactionId,
    };
    newReaction(reaction).then(() => {
      getPostById(id).then(setPost);
    });
  };

  const handleUnReact = (reactionId) => {
    const reactions = post?.postReactions || [];
    const reactionToRemove = reactions.find(
      (reaction) =>
        reaction.reactionId === reactionId &&
        reaction.userProfileId === loggedInUser.id
    );
    if (reactionToRemove) {
      removeReaction(reactionToRemove.id).then(() => {
        getPostById(id).then(setPost);
      });
    } else {
      console.error("No matching reaction found to remove");
    }
  };

  const handleSubscribeBtn = () => {
    if (subscriptionStatus === false) {
      const subscriptionObj = {
        authorId: post.userProfileId,
        subscriberId: loggedInUser.id,
      };

      createSubscription(subscriptionObj).then(() => {
        getSubscriptionStatus(loggedInUser.id, post.userProfileId).then(
          (response) => setSubscriptionStatus(!!response)
        );
      });
    } else {
      deleteSubscription(post.userProfileId).then(() => {
        getSubscriptionStatus(loggedInUser.id, post.userProfileId).then(
          (response) => setSubscriptionStatus(!!response)
        );
      });
    }
  };

  const handleTagChange = (tagId) => {
    const postTagObj = {
      postId: parseInt(id),
      tagId: tagId,
    };
    if (postTags.some((pt) => pt.id === tagId)) {
      deletePostTag(postTagObj).then(() => {
        getTags(id).then(setPostTags);
      });
    } else {
      newPostTag(postTagObj).then(() => {
        getTags(id).then(setPostTags);
      });
    }
  };

  return (
    <div className="container">
      <div className="post-details-header">
        {post.imageUrl !== null ? (
          <img
            alt={`Image for the post named ${post.title}`}
            src={post.imageUrl}
            className="post-header-image mb-2"
          />
        ) : (
          ""
        )}
      </div>
      <div className="post-details-card-header">
        <h4 className="post-details-title">{post.title}</h4>

        <h6 className="post-details-category">{post.category?.categoryName}</h6>
        <Row className="post-details-tags-container">
          {postTags.map((tag) => (
            <Col key={tag.id}>
              <h6 className="post-details-tags">{tag.tagName}</h6>
            </Col>
          ))}
        </Row>
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
      <div className="post-reactions">
        <div className="reactions-group">
          {reactions.map((r) => (
            <Badge
              key={r.id}
              className={`reaction-pill mt-2 text-dark ${
                loggedInUserReactions.includes(r.id) && "custom-badge-info"
              }`}
              color={loggedInUserReactions.includes(r.id) ? "info" : "light"}
              pill
              onClick={() =>
                loggedInUserReactions.includes(r.id)
                  ? handleUnReact(r.id)
                  : handleNewReaction(r.id)
              }
            >
              {r.icon} {reactionCount(r.id)}
            </Badge>
          ))}
        </div>
        {loggedInUser.id === post.userProfileId ? (
          <Button
            className="btn my-post-edit"
            style={{ width: "15%" }}
            onClick={toggle}
          >
            Manage Tags
          </Button>
        ) : (
          <button
            onClick={handleSubscribeBtn}
            className="border rounded shadow-sm btn"
            style={
              subscriptionStatus === true
                ? {
                    backgroundColor: "white",
                    color: "#db534b",
                    borderColor: "#ffa500",
                  }
                : {
                    backgroundColor: "#db534b",
                    color: "white",
                  }
            }
          >
            {subscriptionStatus === false ? "Subscribe" : "Unsubscribe"}
          </button>
        )}
      </div>
      <CommentList loggedInUser={loggedInUser} postId={id} />
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader
          toggle={toggle}
        >{`Manage tags for ${post.title}`}</ModalHeader>
        <ModalBody>
          {allTags.map((t) => (
            <Card
              key={t.id}
              className={`mb-3 text-center tag-card ${
                postTags.some((pt) => pt.id === t.id)
                  ? "hasTag"
                  : "doesntHaveTag"
              }`}
              onClick={() => handleTagChange(t.id)}
            >
              <CardBody>{t.tagName}</CardBody>
            </Card>
          ))}
        </ModalBody>
      </Modal>
    </div>
  );
};
