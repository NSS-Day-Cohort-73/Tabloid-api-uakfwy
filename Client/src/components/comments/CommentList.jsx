import { useEffect, useState } from "react";
import {
  deleteCommentById,
  getAllComments,
  postNewComment,
  updateComment,
} from "../../managers/commentManager";
import { useParams } from "react-router-dom";

export default function CommentList({ loggedInUser, postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentEditComment, setCurrentEditComment] = useState("");
  const [currentEditCommentId, setCurrentEditCommentId] = useState(null);

  //   const { postId } = useParams();

  //hard coding postId for testing
  //const postId = 1;

  useEffect(() => {
    getAllComments(postId)
      .then(setComments)
      .catch((error) => console.error("Problem fetching comments:", error));
  }, []);

  const submitNewComment = () => {
    const trimmedComment = newComment.trim();

    if (!trimmedComment) {
      window.alert("Please enter a comment before submitting");
      return;
    }

    if (trimmedComment.length > 250) {
      window.alert("Please limit your comment to less than 250 characters");
      return;
    }

    const commentToSend = {
      postId: postId,
      //hard coding postId for testing
      //postId: 1,
      userProfileId: loggedInUser.id,
      body: newComment,
    };

    console.log(commentToSend);
    postNewComment(commentToSend).then(() => {
      setNewComment("");
      getAllComments(postId).then(setComments);
    });
  };

  const deleteComment = (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentById(commentId)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to delete comment");
          }
          return getAllComments(postId);
        })
        .then((comments) => {
          setComments(comments);
        })
        .catch((error) => {
          console.error("Error deleting comment:", error);
          window.alert("Failed to delete comment. Please try again.");
        });
    }
  };

  const editComment = (commentId, currentComment) => {
    setCurrentEditComment(currentComment);
    setCurrentEditCommentId(commentId);
  };

  const cancelEditComment = () => {
    setCurrentEditComment("");
    setCurrentEditCommentId(null);
  };

  const postEditComment = (commentId) => {
    const trimmedComment = currentEditComment.trim();

    if (!trimmedComment) {
      window.alert("Please enter a comment before submitting");
      return;
    }

    if (trimmedComment.length > 250) {
      window.alert("Please limit your comment to less than 250 characters");
      return;
    }

    const commentToSend = {
      body: trimmedComment,
    };

    updateComment(commentId, commentToSend)
      .then(() => {
        setCurrentEditComment("");
        setCurrentEditCommentId(null);
        return getAllComments(postId);
      })
      .then((c) => setComments(c));
  };

  return (
    <div className="text-center container mt-4">
      <h2 className="mb-4">Comments</h2>
      <div style={{ width: "75%", margin: "auto" }}>
        <div className="border rounded p-3 shadow-sm d-flex justify-content-between align-items-center">
          <input
            className="form-control me-2"
            style={{ flex: "1" }}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="btn btn-primary" onClick={submitNewComment}>
            Comment
          </button>
        </div>
      </div>
      <div style={{ width: "75%", margin: "auto" }} className="mt-4">
        {comments.map((c) => (
          <div
            key={c.id}
            className="border rounded p-3 shadow-sm d-flex mb-3"
            style={{ minHeight: "80px" }}
          >
            <div className="d-flex align-items-center gap-3">
              <img
                src={c.userProfile.imageLocation}
                className="rounded-circle"
                style={{ height: "60px", width: "60px", objectFit: "cover" }}
                alt="profile picture"
              />
              <div>
                <h6 className="mb-1">{c.userProfile.fullName}</h6>
                <small className="text-muted">
                  {new Date(c.dateSubmitted).toLocaleDateString()}
                </small>
              </div>
            </div>
            <div className="flex-grow-1 ms-4" style={{ maxWidth: "60%" }}>
              {currentEditCommentId === c.id ? (
                <div className="d-flex gap-2">
                  <textarea
                    className="form-control me-2"
                    value={currentEditComment}
                    onChange={(e) => setCurrentEditComment(e.target.value)}
                    rows="3"
                    maxLength="250"
                    style={{ resize: "none" }}
                  />
                  <div className="d-flex gap-2">
                    <button
                      className="border rounded"
                      onClick={cancelEditComment}
                    >
                      ❌
                    </button>
                    <button
                      className="border rounded"
                      onClick={() => postEditComment(c.id)}
                    >
                      ✅
                    </button>
                  </div>
                </div>
              ) : (
                <div className="d-flex justify-content-between align-items-start">
                  <p
                    className="text-start mb-0"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {c.body}
                  </p>
                  {c.userProfileId === loggedInUser.id && (
                    <div className="d-flex gap-2 ms-3">
                      <button
                        className="border rounded"
                        onClick={() => editComment(c.id, c.body)}
                      >
                        ✍️
                      </button>
                      <button
                        className="border rounded"
                        onClick={() => deleteComment(c.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
