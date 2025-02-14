import { useEffect, useState } from "react";
import { getPostById } from "../../managers/postManager";
import { useParams } from "react-router-dom";

export const EditPost = () => {
  const [post, setPost] = useState({});

  const { id } = useParams();

  useEffect(() => {
    getPostById(id).then(setPost);
  }, []);
  return <>Hello Edit Post</>;
};
