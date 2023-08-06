import './Friends.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'


function Friends({friend, index, deleteTodo, editFriend}) {
    return (  
        <div className="friends">
            <p>{friend.name}</p>
            <div className='friends-icon'>
                <FontAwesomeIcon icon={faPenToSquare} onClick={() => editFriend(index)}/>
                <FontAwesomeIcon icon={faTrash} onClick={() => deleteTodo(friend)}/>
            </div>
        </div>
    );
}

export default Friends;