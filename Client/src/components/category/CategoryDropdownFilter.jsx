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
    <div className="mb-4">
      <select
        className="form-select"
        style={{ width: "15%" }}
        aria-label="categories"
        value={selectedCategoryId}
        onChange={handleSelectedCategory}
      >
        <option value={0}>All Posts</option>
        {allCategories.map((cat) => (
          <option value={cat.id} key={cat.id}>
            {cat.categoryName}
          </option>
        ))}
      </select>
    </div>
  );
}
