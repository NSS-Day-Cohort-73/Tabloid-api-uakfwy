import { useEffect, useState } from "react";
import { getAllCategories } from "../../managers/categoryManager";
import { getAllPosts, getPostsByCategoryId } from "../../managers/postManager";

export default function CategoryDropdownFilter({ setPosts }) {
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(0);

  useEffect(() => {
    getAllCategories().then(setAllCategories);
  }, []);

  useEffect(() => {
    if (selectedCategory === 0) {
      getAllPosts().then(setPosts);
    } else {
      getPostsByCategoryId(selectedCategory).then(setPosts);
    }
  }, [selectedCategory]);

  const handleSelectedCategory = (e) => {
    setSelectedCategory(parseInt(e.target.value));
  };

  return (
    <div>
      <select
        className="form-select"
        aria-label="categories"
        value={selectedCategory}
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
