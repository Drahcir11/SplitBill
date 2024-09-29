import './Friends.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import { useBillContext } from '../Hooks/useBillContext'


function Friends({friend, deleteFriend, editFriend}) {

    const { dispatch } = useBillContext();

    return (  
        <div className="friends">
            <p>object - {friend.name}</p>
            <div className='friends-icon'>
                <FontAwesomeIcon icon={faPenToSquare} onClick={() => dispatch({ type: 'TOGGLE_IS_EDIT', payload: friend.person_id}) }/>
                <FontAwesomeIcon icon={faTrash} onClick={() => deleteFriend(friend.person_id)}/>
            </div>
        </div>
    );
}

export default Friends;