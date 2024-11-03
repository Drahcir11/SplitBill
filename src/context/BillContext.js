import { createContext, useReducer } from "react";
import Person from "../classes/Person";
import Item from "../classes/Item";
import { $, multiply, add, minus } from 'moneysafe';
import {$$, subtractPercent, addPercent } from 'moneysafe/ledger';
import { v4 as uuidv4 } from 'uuid'

export const BillContext = createContext();

const initialState = {
    listOfFriends: [],
    listOfItems: [],
    listOfCharges: [],
    itemSubTotalCost: 0.00,
    itemTotalCost: 0.00
};

const calculateSubTotalCost = (listOfItems) => {

    // Loop through each items and calculate item sub total cost
    let updatedItemSubTotalCost = 0.00
    for(const item of listOfItems){
        updatedItemSubTotalCost += multiply($(parseFloat(item.unitPrice).toFixed(2)), $(item.quantity));
    }

    return updatedItemSubTotalCost.toFixed(2);
}

const calculateTotalCost = (itemSubTotalCost, listOfCharges) => {

    if (listOfCharges.length < 1) {
        return itemSubTotalCost
    }

    // Loop through the list of charges/discounts
    let updatedItemTotalCost = itemSubTotalCost
    for(const charges of listOfCharges) {

        // Increase total cost when its service charge
        if(charges["name"] === "Tax" && charges["type"] === "Percentage"){
            updatedItemTotalCost = $$($(updatedItemTotalCost), addPercent(charges["value"]))
        }
        // Decrease total cost when its service charge
        else if(charges["name"] === "Discount" && charges["type"] === "Percentage"){
            updatedItemTotalCost = $$($(updatedItemTotalCost), subtractPercent(charges["value"]))
        }
        else if(charges["name"] === "Tax" && charges["type"] === "Numeric"){
            updatedItemTotalCost = $(updatedItemTotalCost).add($(charges["value"]))
        }
        else if(charges["name"] === "Discount" && charges["type"] === "Numeric"){
            updatedItemTotalCost = $(updatedItemTotalCost).minus($(charges["value"]))
        }
    }

    return updatedItemTotalCost.toFixed(2);
}

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

            const updatedItemList = [...state.listOfItems, newItemObject];

            const updatedItemSubTotalCost = calculateSubTotalCost(updatedItemList);

            const updatedItemTotalCost = calculateTotalCost(updatedItemSubTotalCost, state.listOfCharges);

            return { ...state, listOfItems: updatedItemList, itemSubTotalCost: updatedItemSubTotalCost, itemTotalCost: updatedItemTotalCost };
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

            const updatedItemSubTotalCost = calculateSubTotalCost(updatedItemList);

            const updatedItemTotalCost = calculateTotalCost(updatedItemSubTotalCost, state.listOfCharges);

            return { ...state, listOfItems: updatedItemList, itemSubTotalCost: updatedItemSubTotalCost, itemTotalCost: updatedItemTotalCost };
        }

        case "UPDATE_ITEM_QUANTITY": {
            const { itemId, qtyChange } = action.payload;

            // Loop through each friends and update the matching item's quantity
            const updatedItemList = state.listOfItems.map((item) => {
                if (item.itemId === itemId) {
                    return { ...item, quantity: item.quantity + qtyChange };
                } else {
                    return item;
                }
            });

            const updatedItemSubTotalCost = calculateSubTotalCost(updatedItemList);

            const updatedItemTotalCost = calculateTotalCost(updatedItemSubTotalCost, state.listOfCharges);

            return { ...state, listOfItems: updatedItemList, itemSubTotalCost: updatedItemSubTotalCost, itemTotalCost: updatedItemTotalCost };
        }

        case "REMOVE_ITEM": {
            const { itemId } = action.payload;

            // loop through each items and create a new array that doesn't contain
            // the item to be removed
            const updatedItemList = state.listOfItems.filter((item) => {
                return item.itemId !== itemId;
            });

            const updatedItemSubTotalCost = calculateSubTotalCost(updatedItemList);

            const updatedItemTotalCost = calculateTotalCost(updatedItemSubTotalCost, state.listOfCharges);

            return { ...state, listOfItems: updatedItemList, itemSubTotalCost: updatedItemSubTotalCost, itemTotalCost: updatedItemTotalCost };
        }

        case "RESET_ITEMS": {

            return {...state, listOfItems: [], itemSubTotalCost: 0.00, itemTotalCost: 0.00}
        }

        case "INSERT_ITEM_INTO_FRIEND": {
            const { itemObject, friendId } = action.payload;

            // Loop through each friends and add an object item
            // into the target friend's list of selected items
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
            
            // Loop through each friends and remove an object item
            // from the target friend's list of selected items
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

        case "ADD_CHARGES": {
            const { chargesCategory, chargesValue, chargesValueType } = action.payload;

            // When charge type is empty, then default set into percentage type
            let tempChargesValueType = chargesValueType;
            if(tempChargesValueType.trim() === ""){
                tempChargesValueType = "Percentage"
            }

            const chargesObject = { "chargesId": uuidv4(),"name": chargesCategory, "type": tempChargesValueType, "value": chargesValue  }

            const updatedChargesList = [...state.listOfCharges, chargesObject]

            const updatedItemTotalCost = calculateTotalCost(state.itemSubTotalCost, updatedChargesList)

            return {...state, listOfCharges: updatedChargesList, itemTotalCost: updatedItemTotalCost}
        }

        case "UPDATE_CHARGES_NAME": {
            const { chargesId, newChargesName } = action.payload;

            const updatedChargesList = state.listOfCharges.map((charges)=>{
                if(chargesId === charges["chargesId"]) {
                    return {...charges, name: newChargesName}
                }
                else {
                    return charges
                }
            })

            const updatedItemTotalCost = calculateTotalCost(state.itemSubTotalCost, updatedChargesList)

            return {...state, listOfCharges: updatedChargesList, itemTotalCost: updatedItemTotalCost}
        }

        case "UPDATE_CHARGES_VALUE": {
            const { chargesId, newChargesValue } = action.payload;

            // const regex = /^$|-?\d+(\.\d+)?/g;

            let tempNewChargesValue = newChargesValue;

            // Cap the maximum charges value to 100
            if (tempNewChargesValue >= 100) {
                tempNewChargesValue = 100
            }

            // Cap the minimum charges value to 0
            if (tempNewChargesValue <= 0) {
                tempNewChargesValue = 0
            }

            // Update the new charges value for the target charge
            const updatedChargesList = state.listOfCharges.map((charges)=>{
                if(chargesId === charges["chargesId"]) {
                    return {...charges, value: tempNewChargesValue};
                }
                else {
                    return charges;
                }
            })

            // Re-calculate item total cost after updating charges's value
            const updatedItemTotalCost = calculateTotalCost(state.itemSubTotalCost, updatedChargesList);

            return {...state, listOfCharges: updatedChargesList, itemTotalCost: updatedItemTotalCost};
        }

        case "REMOVE_CHARGES": {
            const { chargesId } = action.payload;

            // Loop through each charges and remove the target charge
            const updatedChargesList = state.listOfCharges.filter((charges)=>{
                return chargesId !== charges["chargesId"]
            })

            // Re-calculate the total cost after removing a charge
            const updatedItemTotalCost = calculateTotalCost(state.itemSubTotalCost, updatedChargesList)

            return {...state, listOfCharges: updatedChargesList, itemTotalCost: updatedItemTotalCost}
        }

        default:
            return state;

    }
};

export const BillContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(BillContextReducer, initialState);

    return <BillContext.Provider value={{ ...state, dispatch }}>{children}</BillContext.Provider>;
};
