import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { deleteTag, getTags } from "../../managers/tagManager";
import "../../styles/tagList.css";

export default function TagList() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getTags().then(setTags);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      deleteTag(id)
        .then(() => setTags(tags.filter(tag => tag.id !==id)))
        .catch(error => alert("Failed to delete tag. Please try again."));
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Tag Management</h2>

      <div className="tag-list">
        {tags.map((tag) => (
          <div key={tag.id} className="tag-item">
            <span className="tag-name">{tag.tagName}</span>
            <div className="tag-actions">
              <Link to={`/tags/edit/${tag.id}`}>
                <Button size="sm" className="custom-btn me-2">
                  ✍️
                </Button>
              </Link>
              <Button className="custom-btn" size="sm" onClick={() => handleDelete(tag.id)}>
                🗑️
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="d-flex justify-content-center mb-3">
          <Link to="/tags/create">
            <Button className="custom-btn">Create New Tag</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
