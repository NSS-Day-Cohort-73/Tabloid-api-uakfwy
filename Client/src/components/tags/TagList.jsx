import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Table } from "reactstrap";
import { getTags } from "../../managers/tagManager";


export default function TagList() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getTags().then(setTags);
  }, []);

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
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}