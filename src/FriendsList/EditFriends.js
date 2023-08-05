import './EditFriends.css'
import React, { useState } from 'react';

function EditFriends({friend, index, deleteTodo, editFriend}) {
    console.log ("inside edit :",friend.isEdit)
    const [value, setValue] = useState(friend.name)
    const handleSubmit = (e) => {
        // prevent default action
        e.preventDefault();
        editFriend(value, index)
        };
    return (
        <form onSubmit={handleSubmit} className="edit-friends">
            <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="todo-input" placeholder={friend.name} />
            <button type="submit" className='todo-btn'>Update Task</button>
        </form>
        // <div className="edit-friends">
        //     <p>{friend.name}</p>
        //     <div className='edit-friends-icon'>
        //         <FontAwesomeIcon icon={faPenToSquare} />
        //         <FontAwesomeIcon icon={faTrash} onClick={() => deleteTodo(friend)}/>
        //     </div>
        // </div>
    );
}

export default EditFriends;