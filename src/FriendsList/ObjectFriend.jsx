import "./ObjectFriends.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { useBillContext } from "../Hooks/useBillContext";

function Friends({ friend }) {
    const { dispatch } = useBillContext();

    const handleNameChange = (e) => {
        e.preventDefault();
        dispatch({ type: "UPDATE_FRIEND_NAME", payload: { friendId: friend.personId, newName: e.target.value } });
    };

    return (
        <div className="friends">
            <input
                className="friends-icon"
                type="text"
                value={friend.name}
                onChange={(e) => handleNameChange(e)}
                style={{
                    fontWeight: "700",
                    fontSize: "14px",
                    outline: "none",
                    backgroundColor: "transparent",
                    borderColor: "transparent",
                }}
            />
            <FontAwesomeIcon icon={faTrash} onClick={() => dispatch({ type: "REMOVE_FRIEND", payload: friend.personId })} />
        </div>
    );
}

export default Friends;
