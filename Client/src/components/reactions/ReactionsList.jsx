import { useEffect, useState } from "react";
import {
  getAllReactions,
  postANewReaction,
} from "../../managers/reactionManager";

export default function ReactionsList() {
  const [reactions, setReactions] = useState([]);
  const [newReactionName, setNewReactionName] = useState("");
  const [newIcon, setNewIcon] = useState("");

  useEffect(() => {
    getAllReactions()
      .then(setReactions)
      .catch((err) => console.error(err));
  }, []);

  const submitNewReaction = () => {
    const trimmedReaction = newReactionName.trim();
    const trimmedIcon = newIcon.trim();

    if (!trimmedReaction || !trimmedIcon) {
      window.alert("Please fill both feilds before submitting");
      return;
    }

    if (trimmedReaction.length < 1) {
      window.alert("A Reaction name must be at least 1 character long");
      return;
    }

    if (trimmedIcon.length > 1) {
      window.alert("An Icon can only be 1 character long");
    }

    const reactionToSend = {
      name: trimmedReaction,
      icon: trimmedIcon,
    };

    postANewReaction(reactionToSend).then(() => {
      setNewIcon("");
      setNewReactionName("");
      getAllReactions().then(setReactions);
    });
  };

  return (
    <div className="text-center container mt-4">
      <h2 className="mb-4" style={{ color: "#6c757d" }}>
        Reactions
      </h2>
      <div className="d-flex flex-column align-items-center gap-3">
        {reactions.map((r) => (
          <div
            key={r.id}
            className="border rounded p-3 shadow-sm d-flex justify-content-center align-items-center"
            style={{ width: "300px", borderColor: "#9ed0e7" }}
          >
            <span
              className="badge rounded-circle p-2 me-3"
              style={{
                backgroundColor: "#9ed0e7",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
            >
              {r.icon}
            </span>
            <h4 className="m-0" style={{ color: "#6c757d" }}>
              {r.name}
            </h4>
          </div>
        ))}
        <div className="d-flex gap-2" style={{ width: "300px" }}>
          <input
            type="text"
            placeholder="Icon"
            value={newIcon}
            onChange={(e) => setNewIcon(e.target.value)}
            className="rounded text-center"
            style={{ width: "50px", borderColor: "#9ed0e7" }}
          ></input>
          <input
            type="text"
            placeholder="Reaction name"
            value={newReactionName}
            onChange={(e) => setNewReactionName(e.target.value)}
            className="rounded flex-grow-1"
            style={{ borderColor: "#9ed0e7", width: "100px" }}
          ></input>
          <button
            className="border rounded px-3"
            style={{
              backgroundColor: "white",
              color: "#9ed0e7",
              borderColor: "#9ed0e7",
            }}
            onClick={submitNewReaction}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
