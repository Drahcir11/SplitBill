import './EditFriends.css'
import EditButton from '../Button/EditButton';
import React, { useState } from 'react';

function EditFriends({friend, index, deleteTodo, editFriend}) {

    const [value, setValue] = useState(friend.name)

    const handleSubmit = (e) => {
        // prevent default action
        e.preventDefault();
        editFriend(value, index)
        };
        
    return (
        <form onSubmit={handleSubmit} className="edit-friends">
            <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="todo-input" placeholder={friend.name} />
            {/* <button type="submit" className='todo-btn'>Update Task</button> */}
            <EditButton buttonName={"Update"} type={"submit"}/>
        </form>
    );
}

export default EditFriends;