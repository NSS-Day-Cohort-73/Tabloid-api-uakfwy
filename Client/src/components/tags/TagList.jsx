import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { deleteTag, getTags } from "../../managers/tagManager";


export default function TagList() {
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTags().then(setTags);
  }, []);

  const handleDelete = (tagId) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
        deleteTag(tagId)
            .then(() => {
                getTags().then(setTags);
            })
            .catch(error => {
                console.error('Error deleting tag:', error);
                alert('Failed to delete tag. Please try again.');
            });
    }
};

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Tag Management</h1>
        <Link to="/tags/create">
          <Button color="primary">Create New Tag</Button>
        </Link>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Tag Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.id}>
              <td>{tag.tagName}</td>
              <td>
                <Link to={`/tags/edit/${tag.id}`}>
                  <Button color="info" size="sm" className="me-2">
                    Edit
                  </Button>
                </Link>
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => handleDelete(tag.id)}
                >
                  Delete
                </Button>  
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}