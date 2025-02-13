import { useEffect, useState } from "react";
import { getAllPosts } from "../../managers/postManager";

export const MyPosts = ({ loggedInUser }) => {
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    getAllPosts((null, loggedInUser.id, null)).then(setUserPosts);
  }, [loggedInUser]);
  return (
    <div className="container">
      <h2 className="text-center mt-5">My Posts</h2>
    </div>
  );
};
