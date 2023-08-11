import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import NextButton from './Button/NextPageButton';

// Function component called "ItemSelection" that takes "bills", "setBills", and "items" as props
function ItemSelection({ bills, setBills, items, setItems, friends, setFriends, checked, setChecked}) {

  useEffect(() => {
    const newChecked = Object.fromEntries(
      friends.map((friend) => [
        friend.name,
        Object.fromEntries(items.map((item) => [item.name, checked[friend.name]?.[item.name] ?? false]))
      ])
    );
  
    setChecked(newChecked);
  }, [friends, items]);
  
  useEffect(() => {
      const updatedItems = items.map(item => ({ ...item, sharedPrice: 0 }));
      setItems(updatedItems);
  }, []);

  useEffect(() => {
    const updatedFriends = friends.map(friend => ({ ...friend, total: 0 }));
    setFriends(updatedFriends);
  }, []);


  // Function to handle checkbox changes when an item is selected for a friend's bill.
  const handleCheck = (e,friendIndex, item, itemIndex, friendval) => {

    const updatedChecked = { ...checked };

    // Toggle the checkbox state for the selected friend and item
    updatedChecked[friendval.name][item.name] = !updatedChecked[friendval.name][item.name];

    setChecked(updatedChecked);

    // Create a new copy of items array
    const updatedItems = items.map((item) => ({ ...item })); 
  
    // access the item to be updated with the itemIndex
    const itemToUpdate = updatedItems[itemIndex];
    
    // Check if the item's friends array is defined, if not, initialize it
    if(!itemToUpdate.friends) {
      itemToUpdate.friends = [];
    }
  
    // Check if the friend's name is already in the item's friends array
    const friendName = friendval.name;
    const friendIndexInItem = itemToUpdate.friends.indexOf(friendName);
  
    // If the friend's name is not in the friends array, add it; otherwise, remove it.
    if (friendIndexInItem === -1) {
      itemToUpdate.friends = [...itemToUpdate.friends, friendName];
    } 
    else {
      itemToUpdate.friends.splice(friendIndexInItem, 1);
    }
  
    updatedItems[itemIndex] = itemToUpdate;
    setItems(updatedItems);

    // copy the friends array
    const updatedFriends = friends.map((friend) => ({...friend}));

    // friends to be updated accessed by its friendIndex
    const friendToUpdate = updatedFriends[friendIndex];

    if(!friendToUpdate.items) {
      friendToUpdate.items = [];
    }

    const itemName = item.name
    // console.log("item name :",itemName)
    const itemIndexInFriend = friendToUpdate.items.indexOf(itemName)

    if(itemIndexInFriend === -1){
      friendToUpdate.items = [...friendToUpdate.items,itemName]
    }
    else{
      friendToUpdate.items.splice(itemIndexInFriend, 1);
    }

    updatedFriends[friendIndex] = friendToUpdate;
    setFriends(updatedFriends);

    // console.log("Friends :",friends)
    // console.log("Items :",items)
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    items.map((item,index) => {
      // console.log("item:",item.name," of length :",item.friends.length)
      item.sharedPrice = item.originalPrice/item.friends.length
      // console.log("item shared price :",item)
      items[index] = item
      setItems(items)
    });
    console.log("items :",items)

    friends.map((friend,index) => {
      friend.items.map((friendItem,nestIndex) => {

        const itemIndexInItems = items.findIndex(item => item.name === friendItem);
        console.log("items :",items[itemIndexInItems].name, "shared price :",items[itemIndexInItems].sharedPrice)
        friends[index].total += parseFloat(items[itemIndexInItems].sharedPrice);
        setFriends(friends);
      })
    });
  };

  // Render the UI components for the Item Selection app.
  return (
    <div>
      <h1>Item Selection</h1>
      <form onSubmit={handleSubmit}>
        {/* Map through the "bills" array to display each friend's bill */}
        {friends.map((friendval, friendIndex) => (
            <div key={friendIndex}>
              {/* Display the friend's name as the subheading */}
              <h2>{friendval.name}</h2>

              {/* Map through the "items" array to display each item with a checkbox */}
              {items.map((item,itemIndex) => (
                  <label key={item.name}>
                    {checked[friendval.name] && checked[friendval.name][item.name] !== undefined &&
                    <input type="checkbox" 
                          checked={checked[friendval.name][item.name]} 
                          onChange={(e) => handleCheck(e, friendIndex, item, itemIndex, friendval)} />
                    }
                    {/* Display the item's name and price */}
                    {item.name} - £{item.originalPrice}
                  </label>
              ))}
            </div>
        ))}
        <button type='submit'>Submit</button>
      </form>
      <Link to='/eachOwed'>
      <NextButton buttonName={"Next"} to={"/eachOwed"}/>
      </Link>
    </div>
  );
}

// Export the ItemSelection component as the default export of this module.
export default ItemSelection;
