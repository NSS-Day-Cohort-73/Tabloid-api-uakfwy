import { useEffect } from "react";
import { getAllCategories } from "../../managers/categoryManager";

export default function CategoryDropdownFilter() {
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    getAllCategories().then(setAllCategories);
  }, []);

  return (
    <div>
      <select class="form-select" aria-label="categories">
        {allCategories.map((cat) => (
          <input value={cat.id}>{cat.categoryName}</input>
        ))}
      </select>
    </div>
  );
}
