import { useEffect, useState } from "react";
import { getAllPosts } from "../../managers/postManager";

export const MyPosts = ({ loggedInUser }) => {
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    getAllPosts();
  }, []);
  return (
    <div className="container">
      <h2>My Posts</h2>
    </div>
  );
};
