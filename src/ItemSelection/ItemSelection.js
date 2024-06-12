import React, { useEffect } from "react";
import NextButton from "../Button/NextPageButton";
import "./ItemSelection.css";

// Function component called "ItemSelection" that takes "bills", "setBills", and "items" as props
function ItemSelection({ props }) {
  const { friends, setFriends, items, setItems, tax, checked, setChecked } = props;

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

  const toggleArrayElement = (array, element) => {
    const index = array.indexOf(element);
    if (index === -1) {
      // Element is not in the array, so add it
      return array.concat(element); // concat() can be used instead of spread operator for simplicity
    } else {
      // Element is in the array, so remove it
      return array.filter((_, i) => i !== index);
    }
  };
  
  function handleCheck(event, friendIndex, item, itemIndex, friendElement) {
    // Get the names of the friend and item involved in the checkbox change
    var friendName = friendElement.name;
    var itemName = item.name;

    /**
     * 
     * @param {useState} previousChecked 
     * previousChecked is not a variable that you have declared somewhere in your component. 
     * It's a value that React passes to your updater function at the time it's called.
     * The updateCheckedState function is being called by the useEffect "setChecked". 
     * @returns {useState} newCheckedState
     */
  
    // Function to toggle the checkbox state
    function updateCheckedState(previousChecked) {

      // Clone the previous checked state
      let newCheckedState = Object.assign({}, previousChecked);
  
      // Clone the state for this particular friend, to avoid mutating it directly
      let friendCheckedState = Object.assign({}, previousChecked[friendName]);
  
      // Toggle the checked state for the specific item for this friend
      friendCheckedState[itemName] = !friendCheckedState[itemName];
  
      // Assign this updated checked state back into the main state
      newCheckedState[friendName] = friendCheckedState;
  
      return newCheckedState;
    }
  
    // Call setChecked with the update function to update the state
    setChecked(updateCheckedState);
  
    // Function to update the items state
    function updateItemsState(previousItems) {

      // Map over the previous items to produce a new array of items
      return previousItems.map(function (currentItem, idx) {
        if (idx === itemIndex) {
          // If it's the item we're interested in, toggle the friend in the friends list
          return {
            ...currentItem,
            friends: toggleArrayElement(currentItem.friends || [], friendName),
          };
        } else {
          // Otherwise, return the item as it was
          return currentItem;
        }
      });
    }
  
    // Call setItems with the update function to update the state
    setItems(updateItemsState);
  
    // Function to update the friends state
    function updateFriendsState(previousFriends) {
      // Map over the previous friends to produce a new array of friends
      return previousFriends.map(function (currentFriend, idx) {
        if (idx === friendIndex) {
          // If it's the friend we're interested in, toggle the item in the items list
          return {
            ...currentFriend,
            items: toggleArrayElement(currentFriend.items || [], itemName),
          };
        } else {
          // Otherwise, return the friend as it was
          return currentFriend;
        }
      });
    }
  
    // Call setFriends with the update function to update the state
    setFriends(updateFriendsState);
  }
  

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
      <h1 style={{fontSize: "24px", fontWeight: "700", marginBlockEnd: "0px", marginBlockStart: "48px"}} >Item Selection</h1>
      <h5 style={{fontWeight: "500", fontSize: "12px", marginBlockStart:"0px", marginBlockEnd: "24px"}}> 
          Be honest and select items that you ate.
      </h5>
      <form className="friends-items">
        {/* Map through the "bills" array to display each friend's bill */}
        {friends.map((friendElement, friendIndex) => (
          <div className="friend-container" key={friendIndex} style={{backgroundColor: "White", display:"flex", flexDirection:"column"}}>
            <div style={{display:"flex", justifyContent:"center"}}>
              {/* Display the friend's name as the subheading */}
              <h4 className="friendName" style={{
                marginBlockStart: "0px",
              }}>{friendElement.name}</h4>
            </div>
            <div className="items-per-friend">
              {/* Map through the "items" array to display each item with a checkbox */}
              {items.map((item, itemIndex) => {
                // Start by checking if the checked state for this friend and item exists
                let isItemChecked = false;
                if (
                  checked[friendElement.name] &&
                  checked[friendElement.name][item.name] !== undefined
                ) {
                  // If it does exist, use that state to determine if the checkbox is checked
                  isItemChecked = checked[friendElement.name][item.name];
                }

                let isSelected = checked[friendElement.name] && checked[friendElement.name][item.name];

                return (
                  <div
                    key={item.name}
                    className={`itemSelection ${isSelected ? 'selected' : ''}`}
                    onClick={(e) => handleCheck(e, friendIndex, item, itemIndex, friendElement)}
                    style={{
                      fontSize: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: "0px",
                      paddingBottom: "0px"
                    }}
                  >
                    <p> {item.name}</p>
                    <p> £{item.originalPrice}</p>
                    {/* {item.name} - £{item.originalPrice} */}
                  </div>
                );
              })}
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
