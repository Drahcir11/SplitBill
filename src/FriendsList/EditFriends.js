import "./EditFriends.css";
import EditButton from "../Button/EditButton";
import React, { useState } from "react";
import { isValidInput, noWhiteSpace } from "../ErrorHandling";
function EditFriends({ friend, index, deleteTodo, editFriend }) {
  const [value, setValue] = useState(friend.name);

  const handleSubmit = (e) => {
    // prevent default action
    e.preventDefault();
    if(!noWhiteSpace(value)){
        return;
    }
    editFriend(value, index);
  };

  return (
    <form onSubmit={handleSubmit} className="edit-friends">
      <input
        type="text"
        value={value}
        style={{
          height: "2em"
        }}
        onChange={(e) => {
          if (isValidInput(e.target.value)) {
            setValue(e.target.value);
          }
        }}
        className="todo-input"
        placeholder={friend.name}
      />
      {/* <button type="submit" className='todo-btn'>Update Task</button> */}
      <EditButton buttonName={"Update"} type={"submit"} />
    </form>
  );
}

export default EditFriends;
