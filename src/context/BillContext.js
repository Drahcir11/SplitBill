import { createContext, useReducer } from "react";
import Person from "../classes/Person";
import Item from "../classes/Item";

export const BillContext = createContext();

const initialState = {
    listOfFriends: [],
    listOfItems: [],
};

export const BillContextReducer = (state, action) => {
    switch (action.type) {
        case "ADD_FRIEND": {
            // Extract friend's name
            const friendName = action.payload;
            const newPersonObject = new Person(friendName);

            // Create a new array with the existing friends plus the new friend from action.payload
            const updatedFriendsList = [...state.listOfFriends, newPersonObject];

            // Return the updated state, making sure to keep all other state properties intact
            return { ...state, listOfFriends: updatedFriendsList };
        }

        case "REMOVE_FRIEND": {
            // Extract the target friend's unique object ID to be removed
            const friendId = action.payload;

            // Create a new array without the friend at the given index
            const updatedFriendsList = state.listOfFriends.filter((friend) => {
                // Keep all friends whose index does not match the one we want to remove
                return friend.personId !== friendId;
            });

            // Return the updated state with the modified friends list
            return { ...state, listOfFriends: updatedFriendsList };
        }

        case "UPDATE_FRIEND_NAME": {
            // Extract the target friend and its new name
            const { friendId, newName } = action.payload;

            console.log("friend id", friendId, "new friend name: ", newName);

            // Loop through each friends and rename the one with matching friend ID
            const updatedFriendsList = state.listOfFriends.map((friend) => {
                if (friend.personId === friendId) {
                    return { ...friend, name: newName };
                } else {
                    return friend;
                }
            });

            // Return an updated list of friends
            return { ...state, listOfFriends: updatedFriendsList };
        }

        case "ADD_ITEM": {
            const { itemName, unitPrice, quantity } = action.payload;

            const newItemObject = new Item(itemName, unitPrice, quantity);

            const updatedItemsList = [...state.listOfItems, newItemObject];

            console.log("Added new item :", newItemObject);

            return { ...state, listOfItems: updatedItemsList };
        }

        case "UPDATE_ITEM_NAME": {
            const { itemId, newItemName } = action.payload;

            // Loop through each item and rename the one with matching item ID
            const updatedItemsList = state.listOfItems.map((item) => {
                if (item.itemId === itemId) {
                    return { ...item, name: newItemName };
                } else {
                    return item;
                }
            });

            // Return an updated array of items
            return { ...state, listOfItems: updatedItemsList };
        }

        case "UPDATE_ITEM_UNIT_PRICE": {
            const { itemId, newItemUnitPrice } = action.payload;

            const updatedItemList = state.listOfItems.map((item) => {
                if (item.itemId === itemId) {
                    return { ...item, unitPrice: newItemUnitPrice };
                }
                else {
                    return item
                }
            });

            return { ...state, listOfItems: updatedItemList };
        }

        case "UPDATE_ITEM_QUANTITY": {
            const { itemId, qtyChange } = action.payload;

            // Loop through each friends and update the matching item's quantity
            const updatedItemsList = state.listOfItems.map((item) => {
                if (item.itemId === itemId) {
                    return { ...item, quantity: item.quantity + qtyChange };
                } else {
                    return item;
                }
            });

            return { ...state, listOfItems: updatedItemsList };
        }

        case "REMOVE_ITEM": {
            const { itemId } = action.payload;

            // loop through each items and create a new array that doesn't contain
            // the item to be removed
            const updatedItemList = state.listOfItems.filter((item) => {
                return item.itemId !== itemId;
            });

            return { ...state, listOfItems: updatedItemList };
        }

        case "RESET_ITEMS": {

            return {...state, listOfItems: []}
        }

        case "INSERT_ITEM_INTO_FRIEND": {
            const { itemObject, friendId } = action.payload;

            const updatedFriendsList = state.listOfFriends.map((friend)=>{
                if(friend.personId === friendId){
                    return {...friend, selectedItems: [...friend.selectedItems, itemObject]}
                }
                else{
                    return friend
                }
            })

            return {...state, listOfFriends: updatedFriendsList}

        }

        case "REMOVE_ITEM_FROM_FRIEND": {
            const { targetItemId, friendId } = action.payload;

            const updatedFriendsList = state.listOfFriends.map((friend)=>{
                if(friend.personId === friendId){
                    const updatedSelectedItems = friend.selectedItems.filter((itemObject)=>{
                        return itemObject.itemId !== targetItemId
                    })
                    return {...friend, selectedItems: updatedSelectedItems}
                }
                else{
                    return friend
                }
            })

            return {...state, listOfFriends: updatedFriendsList}

        }

        default:
            return state;

    }
};

export const BillContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(BillContextReducer, initialState);

    return <BillContext.Provider value={{ ...state, dispatch }}>{children}</BillContext.Provider>;
};
