import { useEffect, useState } from "react";
import { postsFromSubscription } from "../../managers/postManager";

export const SubscribedPosts = ({ loggedInUser }) => {
  const [subPosts, setSubPosts] = useState([]);

  useEffect(() => {
    postsFromSubscription(loggedInUser.id).then(setSubPosts);
  }, [loggedInUser]);
  return <div className="container"></div>;
};
