import { createContext, useReducer } from "react";
import Person from "../classes/Person";
import Item from "../classes/Item";
import { $, multiply, divide, add, minus } from 'moneysafe';
import {$$, subtractPercent, addPercent } from 'moneysafe/ledger';
import { v4 as uuidv4 } from 'uuid'

export const BillContext = createContext();

const initialState = {
    listOfFriends: [],
    listOfItems: [],
    listOfCharges: [],
    itemSubTotalCost: 0.00,
    itemTotalCost: 0.00,
    currency: "£"
};

export const calculateSubTotalCost = (listOfItems) => {

    // Loop through each items and calculate item sub total cost
    let updatedItemSubTotalCost = 0.00
    for(const item of listOfItems){
        updatedItemSubTotalCost += multiply($(parseFloat(item.unitPrice).toFixed(2)), $(item.quantity));
    }

    return updatedItemSubTotalCost.toFixed(2);
}

export const calculateTotalCost = (itemSubTotalCost, listOfCharges) => {

    if (listOfCharges.length < 1) {
        return itemSubTotalCost
    };

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

        case "UPDATE_CURRENCY": {
            const { newCurrency } = action.payload;

            return {...state, currency: newCurrency}
        }

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

            // Remove friends from items selected by list
            const updatedItemsList = state.listOfItems.map((item) => {

                // Skip when item hasn't selected by anyone
                if (item.selectedBy.length < 1) {
                    return item;
                }

                const updatedItemsSelectedBy = item.selectedBy.filter((friendObjectId) => {
                    return friendObjectId !== friendId;
                })

                return {...item, selectedBy: updatedItemsSelectedBy}
            })

            // Return the updated state with the modified friends list
            return { ...state, listOfFriends: updatedFriendsList, listOfItems: updatedItemsList };
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
            let { itemName, unitPrice, quantity } = action.payload;

            if(typeof unitPrice === "number"){
                return state;
            }

            unitPrice = unitPrice.replace(",", "")

            // Construct item class object
            const totalPrice = multiply($(parseFloat(unitPrice).toFixed(2)), $(quantity))
            const newItemObject = new Item(itemName, unitPrice, quantity, parseFloat(totalPrice.toFixed(2)));

            // Add new item class object into an updated list of items
            const updatedItemList = [...state.listOfItems, newItemObject];

            // Re-calculate and update sub total and total cost
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
            let { itemId, newItemUnitPrice } = action.payload;

            // Converts values "010" into "10"
            if (newItemUnitPrice.startsWith("0") && newItemUnitPrice.length > 1){
                newItemUnitPrice = newItemUnitPrice.substring(1);
            }

            // When new unit price is an empty string then to 0.00 
            if (newItemUnitPrice.length < 1 && newItemUnitPrice === ""){
                newItemUnitPrice = 0.00;
            }

            // Loop through each item and update the target item's unit price
            // NOTE: Use ParseFloat and toFixed() to safely pass currency values
            const updatedItemList = state.listOfItems.map((item) => {
                if (item.itemId === itemId) {

                    // Re-calculate the item's new total price
                    const newTotalPrice = multiply($(parseFloat(newItemUnitPrice).toFixed(2)), $(item.quantity))
                    return { ...item, unitPrice: newItemUnitPrice, totalPrice: parseFloat(newTotalPrice.toFixed(2)) };
                }
                else {
                    return item
                }
            });

            // Re-calculate and update sub total and total cost
            const updatedItemSubTotalCost = calculateSubTotalCost(updatedItemList);
            const updatedItemTotalCost = calculateTotalCost(updatedItemSubTotalCost, state.listOfCharges);

            return { ...state, listOfItems: updatedItemList, itemSubTotalCost: updatedItemSubTotalCost, itemTotalCost: updatedItemTotalCost };
        }

        case "UPDATE_ITEM_QUANTITY": {
            const { itemId, qtyChange } = action.payload;

            // Loop through each friends and update the matching item's quantity
            const updatedItemList = state.listOfItems.map((item) => {
                if (item.itemId === itemId) {

                    // Re-calculate the item's new total price
                    const newQuantity = item.quantity + qtyChange
                    const newTotalPrice = multiply($(parseFloat(item.unitPrice).toFixed(2)), $(newQuantity))
                    return { ...item, quantity: newQuantity, totalPrice: parseFloat(newTotalPrice.toFixed(2)) };
                } else {
                    return item;
                }
            });
            
            // Re-calculate and update sub total and total cost
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

            // Remove items from friends selected items list
            const updatedFriendsList = state.listOfFriends.map((friend) => {

                // Skip when friend hasn't selected any item
                if (friend.selectedItems.length < 1) {
                    return friend;
                }

                const updatedFriendSelectedItems = friend.selectedItems.filter((itemObjectId) => {
                    return itemObjectId !== itemId;
                })

                return {...friend, selectedItems: updatedFriendSelectedItems}
            })

            // Re-calculate and update sub total and total cost
            const updatedItemSubTotalCost = calculateSubTotalCost(updatedItemList);
            const updatedItemTotalCost = calculateTotalCost(updatedItemSubTotalCost, state.listOfCharges);

            return { ...state, listOfItems: updatedItemList, listOfFriends: updatedFriendsList, itemSubTotalCost: updatedItemSubTotalCost, itemTotalCost: updatedItemTotalCost };
        }

        case "RESET_ITEMS": {
            // Reset data related to items
            // NOTE: This only happens after re-cropping receipt images
            return {...state, listOfItems: [], itemSubTotalCost: 0.00, itemTotalCost: 0.00}
        }

        case "INSERT_ITEM_INTO_FRIEND": {
            const { itemObject, friendObject } = action.payload;

            // Loop through each friends and add item id
            // into the target friend's list of selected items
            const updatedFriendsList = state.listOfFriends.map((friend)=>{
                if(friend.personId === friendObject.personId){
                    return {...friend, selectedItems: [...friend.selectedItems, itemObject.itemId]}
                }
                else{
                    return friend
                }
            })

            // Loop through each item and add friend into the selected item
            const updatedItemList = state.listOfItems.map((item) => {
                if(item.itemId === itemObject.itemId){
                    return {...item, selectedBy: [...item.selectedBy, friendObject.personId]}
                }
                else {
                    return item;
                }
            })

            return {...state, listOfFriends: updatedFriendsList, listOfItems: updatedItemList}

        }

        case "REMOVE_ITEM_FROM_FRIEND": {
            const { itemObject, friendObject } = action.payload;
            
            // Loop through each friends and remove item id
            // from the target friend's list of selected items
            const updatedFriendsList = state.listOfFriends.map((friend)=>{
                if(friend.personId === friendObject.personId){
                    const updatedSelectedItems = friend.selectedItems.filter((itemObjectId)=>{
                        return itemObjectId !== itemObject.itemId
                    })
                    return {...friend, selectedItems: updatedSelectedItems}
                }
                else{
                    return friend
                }
            })

            // Loop through each items and remove the friend id
            // from the target item's list of selected by
            const updatedItemList = state.listOfItems.map((item) => {
                if(item.itemId === itemObject.itemId){
                    const updatedSelectedBy = item.selectedBy.filter((selectedByFriendId) =>{
                        return selectedByFriendId !== friendObject.personId
                    })
                    return {...item, selectedBy: updatedSelectedBy}
                }
                else {
                    return item;
                }
            })

            return {...state, listOfFriends: updatedFriendsList, listOfItems: updatedItemList}

        }

        case "ADD_CHARGES": {
            const { chargesCategory, chargesValue, chargesValueType } = action.payload;

            // When charge type is empty, then default set into percentage type
            let tempChargesValueType = chargesValueType;
            if(tempChargesValueType.trim() === ""){
                tempChargesValueType = "Percentage"
            }

            // Construct new charges objects
            const chargesObject = { "chargesId": uuidv4(),"name": chargesCategory, "type": tempChargesValueType, "value": chargesValue}
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
            let { chargesId, newChargesValue } = action.payload;

            if (newChargesValue.startsWith("0") && newChargesValue.length > 1){
                newChargesValue = newChargesValue.substring(1);
            }
            
            if (newChargesValue.length < 1 && newChargesValue === ""){
                newChargesValue = 0.00
            }

            // Extract the type of the target charges
            let chargesType = ""
            for(const charges of state.listOfCharges){
                if(chargesId === charges["chargesId"]){
                    chargesType = charges["type"]
                }
            }

            // Only set maximum and minimum values for percentage charges value
            if (chargesType === "Percentage"){

                // Cap the maximum charges value to 100
                if (newChargesValue >= 100) {
                    newChargesValue = 100
                }
    
                // Cap the minimum charges value to 0
                if (newChargesValue <= 0) {
                    newChargesValue = 0
                }
            }

            // Update the new charges value for the target charge
            const updatedChargesList = state.listOfCharges.map((charges)=>{
                if(chargesId === charges["chargesId"]) {
                    return {...charges, value: newChargesValue};
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

        case "SPLIT_BILL": {
            
            // Do nothing if for whatever reason, sub total and total cost
            // is zero or less than zero
            const numericItemTotalCost = Number(state.itemTotalCost);
            const numericItemSubTotalCost = Number(state.itemSubTotalCost);
            if( numericItemTotalCost <= 0.00 || numericItemSubTotalCost <= 0.00|| isNaN(numericItemTotalCost) || isNaN(numericItemSubTotalCost)) {
                return state;
            }

            const priceMultiplier = parseFloat(state.itemTotalCost/state.itemSubTotalCost).toFixed(12);

            // Map and calculate the shared prices of each item as key-value pair
            const updatedItemSharedPrices = {}
            for(const item of state.listOfItems) {
                const totalPriceItem = multiply($(item.unitPrice), $(item.quantity))

                // Set shared price item to zero when no one selected the item
                let sharedPriceItem
                if(item.selectedBy.length < 1){
                    sharedPriceItem = "0.00"
                }
                else {

                    sharedPriceItem = parseFloat(divide($(totalPriceItem), $(item.selectedBy.length))).toFixed(2);
                }
                updatedItemSharedPrices[item.itemId] = sharedPriceItem;
            }

            const updatedItemsList = state.listOfItems.map((item) =>{
                return {...item, sharedUnitPrice: updatedItemSharedPrices[item.itemId]}
            })
            
            // Loop through each items and calculate the total bill
            const updatedFriendsList = state.listOfFriends.map((friend) =>{

                // Calculate each friend's sub total based on item's shared prices
                let friendSubTotal = 0.00
                for(const itemSelectedId of friend.selectedItems){
                    friendSubTotal = $(updatedItemSharedPrices[itemSelectedId]).add($(friendSubTotal))
                }

                // Calculate each friend's total bill with price modifier
                const calculatedTotalBill = parseFloat(friendSubTotal * priceMultiplier).toFixed(2);
                const percentageCharges = parseFloat(priceMultiplier - 1.00).toFixed(12);
                const calculatedCharges = parseFloat(percentageCharges * friendSubTotal).toFixed(2);
                return {
                        ...friend, 
                        subTotal: parseFloat(friendSubTotal).toFixed(2), 
                        totalBill: calculatedTotalBill, 
                        chargesValue: calculatedCharges,
                        chargesPercentage: percentageCharges
                    }
            })

            return {...state, listOfFriends: updatedFriendsList, listOfItems: updatedItemsList};
        }

        case "RESTART_ALL": {
            return {...state, listOfFriends: [], listOfItems: [], listOfCharges: [], itemSubTotalCost: 0.00, itemTotalCost: 0.00, currency: "£"}
        }

        default:
            return state;

    }
};

export const BillContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(BillContextReducer, initialState);

    return <BillContext.Provider value={{ ...state, dispatch }}>{children}</BillContext.Provider>;
};
