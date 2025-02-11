import { useEffect, useState } from "react";
import {
  getAllCategories,
  postNewCategory,
} from "../../managers/categoryManager";
import { Table } from "reactstrap";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    getAllCategories()
      .then(setCategories)
      .catch((err) => console.error(err));
  }, []);

  //CONSOLE LOG FOR NOW
  const deleteCategory = (catId) => {
    console.log(`delete ${catId}`);
  };

  //CONSOLE LOG FOR NOW
  const editCategory = (catId) => {
    console.log(`edit ${catId}`);
  };

  const submitNewCategory = () => {
    const trimmedCat = newCategory.trim();

    if (!trimmedCat) {
      window.alert("Please enter a category name before submitting");
      return;
    }

    if (trimmedCat.length < 3) {
      window.alert("A category name must be at least 3 characters long");
      return;
    }

    const categoryToSend = {
      categoryName: trimmedCat,
    };

    postNewCategory(categoryToSend).then(() => {
      setNewCategory("");
      getAllCategories().then(setCategories);
    });
  };

  return (
    <div className="text-center container mt-4">
      <h2 className="mb-4">Categories</h2>
      <div className="d-flex flex-column align-items-center gap-3">
        {categories.map((c) => (
          <div
            key={c.id}
            className="border rounded p-3 w-50 shadow-sm d-flex justify-content-between align-items-center"
          >
            {c.categoryName}
            <div className="d-flex gap-2">
              <button
                className="border rounded"
                onClick={() => editCategory(c.id)}
              >
                ✍️
              </button>
              <button
                className="border rounded"
                onClick={() => deleteCategory(c.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
        <div className="d-flex gap-2">
          <input
            type="text"
            placeholder="     add new category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          ></input>
          <button
            className="border rounded shadow-sm"
            onClick={submitNewCategory}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
