import { useEffect, useState } from "react";
import {
  deleteCommentById,
  getAllComments,
  postNewComment,
} from "../../managers/commentManager";
import { useParams } from "react-router-dom";

export default function CommentList({ loggedInUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentEditComment, setCurrentEditComment] = useState("");
  const [currentEditCommentId, setCurrentEditCommentId] = useState(null);

  //const { postId } = useParams();
  const postId = 1;

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
      //postId: postId,
      postId: 1,
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

  return (
    <div className="text-center container mt-4">
      <h2>Comments</h2>
      <div className="container">
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
      <div className="container mt-3">
        {comments.map((c) => (
          <div
            key={c.id}
            className="border rounded p-3 shadow-sm d-flex align-items-center mb-3"
            style={{ height: "80px" }}
          >
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ width: "80px" }}
            >
              <img
                src={c.userProfile.imageLocation}
                className="img-fluid rounded-circle"
                style={{ height: "80px", width: "80px", objectFit: "cover" }}
                alt="profile picture"
              />
            </div>
            <div className="p-2 mt-1">
              <h6 className="mt-2">
                {new Date(c.dateSubmitted).toLocaleDateString()}
              </h6>
              <h5>{c.userProfile.fullName}</h5>
            </div>
            <p className="p-3 mt-3 ms-auto">{c.body}</p>
            {c.userProfileId === loggedInUser.id && (
              <div className="d-flex gap-2">
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
        ))}
      </div>
    </div>
  );
}
