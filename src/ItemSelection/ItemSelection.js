import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NextButton from "../Button/NextPageButton";
import "./ItemSelection.css";

// Function component called "ItemSelection" that takes "bills", "setBills", and "items" as props
function ItemSelection({ props }) {
  const { friends, setFriends, items, setItems, tax, setTax, checked, setChecked } = props;

  useEffect(() => {
    const newChecked = Object.fromEntries(
      friends.map((friend) => [friend.name, Object.fromEntries(items.map((item) => [item.name, checked[friend.name]?.[item.name] ?? false]))])
    );

    setChecked(newChecked);
  }, [friends, items]);

  useEffect(() => {
    const updatedItems = items.map((item) => ({
      ...item,
      priceWithTax: 0,
      sharedPrice: 0,
    }));
    setItems(updatedItems);
  }, []);

  useEffect(() => {
    const updatedFriends = friends.map((friend) => ({ ...friend, total: 0 }));
    setFriends(updatedFriends);
  }, []);

  // Function to handle checkbox changes when an item is selected for a friend's bill.
  const handleCheck = (e, friendIndex, item, itemIndex, friendval) => {
    const updatedChecked = { ...checked };

    // Toggle the checkbox state for the selected friend and item
    updatedChecked[friendval.name][item.name] = !updatedChecked[friendval.name][item.name];

    setChecked(updatedChecked);

    // Create a new copy of items array
    const updatedItems = items.map((item) => ({ ...item }));

    // access the item to be updated with the itemIndex
    const itemToUpdate = updatedItems[itemIndex];

    // Check if the item's friends array is defined, if not, initialize it
    if (!itemToUpdate.friends) {
      itemToUpdate.friends = [];
    }

    // Check if the friend's name is already in the item's friends array
    const friendName = friendval.name;
    const friendIndexInItem = itemToUpdate.friends.indexOf(friendName);

    // If the friend's name is not in the friends array, add it; otherwise, remove it.
    if (friendIndexInItem === -1) {
      itemToUpdate.friends = [...itemToUpdate.friends, friendName];
    } else {
      itemToUpdate.friends.splice(friendIndexInItem, 1);
    }

    updatedItems[itemIndex] = itemToUpdate;
    setItems(updatedItems);

    // copy the friends array
    const updatedFriends = friends.map((friend) => ({ ...friend }));

    // friends to be updated accessed by its friendIndex
    const friendToUpdate = updatedFriends[friendIndex];

    if (!friendToUpdate.items) {
      friendToUpdate.items = [];
    }

    const itemName = item.name;
    // console.log("item name :",itemName)
    const itemIndexInFriend = friendToUpdate.items.indexOf(itemName);

    if (itemIndexInFriend === -1) {
      friendToUpdate.items = [...friendToUpdate.items, itemName];
    } else {
      friendToUpdate.items.splice(itemIndexInFriend, 1);
    }

    updatedFriends[friendIndex] = friendToUpdate;
    setFriends(updatedFriends);
  };

  // Calculate tax for each item
const calculateTotalTax = (tax) => {

  let calculatedTax = 0.0;

  tax.forEach((taxPercentage) => {
    calculatedTax += parseFloat(taxPercentage.originalPrice) / 100.0;
  });

  return calculatedTax;
};

// Update item with tax
const updateItemWithTax = (item, calculatedTax) => {
  let calculatedPriceWithTax = item.originalPrice * item.quantity * (1+ calculatedTax);

  let updatedItem = {
    ...item,
    priceWithTax : calculatedPriceWithTax
  };

  return updatedItem;
}

// Calculate shared price
const updateSharedPrice = (item) => {
  let calculatedSharedPrice = item.priceWithTax / item.friends.length;

  let updatedItem = {
    ...item,

    sharedPrice : calculatedSharedPrice
  };

  return updatedItem;
}

// Update friends total
const updateFriendTotal = (friend, items) => {

  let total = 0;

  friend.items.forEach((friendItem) => {
    const itemIndexInItems = items.findIndex((item) => item.name === friendItem);
    total += parseFloat(items[itemIndexInItems].sharedPrice);
  });
  return {
    ...friend,
    total,
  };
};

// Main handleSubmit function
const handleSubmit = () => {

  // Calculate tax and update items
  const updatedItems = items.map((item) => {
    const calculatedTax = calculateTotalTax(tax);
    return updateItemWithTax(item, calculatedTax);
  });
  setItems(updatedItems);

  // Calculate shared price for items
  const itemsWithSharedPrice = updatedItems.map((item) =>{
    return updateSharedPrice(item);
  });
  setItems(itemsWithSharedPrice);

  // Update friends with their totals
  const updatedFriends = friends.map((friend) => {
    return updateFriendTotal(friend, itemsWithSharedPrice);
  });
  setFriends(updatedFriends);
};

  // Render the UI components for the Item Selection app.
  return (
    <div className="item-selection">
      <h1>Item Selection</h1>
      <form className="friends-items">
        {/* Map through the "bills" array to display each friend's bill */}
        {friends.map((friendval, friendIndex) => (
          <div key={friendIndex}>
            {/* Display the friend's name as the subheading */}
            <h2>{friendval.name}</h2>
            <div className="items-per-friend">
              {/* Map through the "items" array to display each item with a checkbox */}
              {items.map((item, itemIndex) => (
                <label key={item.name}>
                  {checked[friendval.name] && checked[friendval.name][item.name] !== undefined && (
                    <input
                      type="checkbox"
                      checked={checked[friendval.name][item.name]}
                      onChange={(e) => handleCheck(e, friendIndex, item, itemIndex, friendval)}
                    />
                  )}
                  {/* Display the item's name and price */}
                  {item.name} - £{item.originalPrice}
                </label>
              ))}
            </div>
          </div>
        ))}
      </form>
      <NextButton buttonName={"Next"} to={"/eachOwed"} clickEvent={handleSubmit} />
    </div>
  );
}

// Export the ItemSelection component as the default export of this module.
export default ItemSelection;
