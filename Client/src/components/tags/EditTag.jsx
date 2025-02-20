import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTagById, updateTag } from "../../managers/tagManager";
import "../../styles/tagForm.css";

export const EditTag = () => {
  const [tag, setTag] = useState({
    id: 0,
    tagName: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getTagById(id).then(setTag);
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTag((prevTag) => ({
      ...prevTag,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    updateTag(tag).then(() => {
      navigate("/tags");
    });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 mt-3">
          <h2>Edit Tag</h2>
          <form>
            <div className="form-group mt-4">
              <label htmlFor="tagName">Tag Name:</label>
              <input
                type="text"
                className="form-control"
                id="tagName"
                name="tagName"
                value={tag.tagName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="button-group">
              <button className="custom-btn" onClick={handleSave} type="button">
                Save
              </button>
              <button
                className="custom-btn"
                onClick={() => navigate("/tags")}
                type="button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
