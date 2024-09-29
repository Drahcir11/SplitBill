import { createContext, useReducer } from 'react'
import Person from '../classes/Person';

export const BillContext = createContext();

const initialState = {
    listOfFriends : []
}

export const BillContextReducer = (state, action) => {
    switch (action.type) {

        case 'ADD_FRIEND': {

            // Extract friend's name
            const friendName = action.payload;

            const newPersonObject = new Person(friendName);

            // Create a new array with the existing friends plus the new friend from action.payload
            const updatedFriendsList = [...state.listOfFriends, newPersonObject];

            // Return the updated state, making sure to keep all other state properties intact
            return {...state, listOfFriends: updatedFriendsList};
        }

        case 'REMOVE_FRIEND': {
            // Extract the target friend's unique object ID to be removed
            const friendId = action.payload;

            // Create a new list without the friend at the given index
            const updatedFriendsList = state.listOfFriends.filter((friend) => {

                // Keep all friends whose index does not match the one we want to remove
                return friend.person_id !== friendId;
            });

            // Return the updated state with the modified friends list
            return {...state, listOfFriends: updatedFriendsList};
        }

        case 'TOGGLE_IS_EDIT' : {

            const friendId = action.payload;
            const updatedFriendsList = state.listOfFriends.map(friend => {
                if(friend.person_id === friendId){
                    return {...friend, isEdit: !friend.isEdit};
                }
                else {
                    return friend;
                }
            })

            return {...state, listOfFriends: updatedFriendsList};
            
        }

        case 'UPDATE_NAME' : {

            const { friendId, newName } = action.payload;

            console.log(friendId, newName)

            const updatedFriendsList = state.listOfFriends.map( friend => {
                if (friend.person_id === friendId) {
                    return {...friend, name: newName, isEdit: !friend.isEdit}
                }
                else {
                    return friend
                }
            })

            return {...state, listOfFriends: updatedFriendsList};

        }

        default:
            return state;
    }
}

export const BillContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(BillContextReducer, initialState)

    return (
        <BillContext.Provider value={{...state, dispatch}}>
            { children }
        </BillContext.Provider>
    )
}