import { useEffect, useState } from "react";
import { getAllCategories } from "../../managers/categoryManager";

export default function CategoryDropdownFilter({
  setPosts,
  setSelectedCategoryId,
  selectedCategoryId,
}) {
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    getAllCategories().then(setAllCategories);
  }, []);

  const handleSelectedCategory = (e) => {
    setSelectedCategoryId(parseInt(e.target.value));
  };

  return (
    <div
      className="d-flex mb-4"
      style={{ marginLeft: "32px", paddingLeft: "32px" }}
    >
      <select
        className="form-select shadow-sm"
        style={{
          width: "250px",
          padding: "10px 15px",
          border: "1px solid #ced4da",
          fontSize: "16px",
          cursor: "pointer",
        }}
        aria-label="categories"
        value={selectedCategoryId}
        onChange={handleSelectedCategory}
      >
        <option value={0} style={{ fontWeight: "500" }}>
          All Categories
        </option>
        {allCategories.map((cat) => (
          <option value={cat.id} key={cat.id} style={{ padding: "8px" }}>
            {cat.categoryName}
          </option>
        ))}
      </select>
    </div>
  );
}
