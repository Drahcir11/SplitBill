import React, { useState } from "react";
import NextButton from "../Button/NextPageButton";
import AddButton from "../Button/AddButton";
import "./ItemsList.css";
import Item from "./Item";
import EditItem from "./EditItem";
import { isNumber, isValidInput, noWhiteSpace } from "../ErrorHandling";

// Function component called "BillSplitter" that takes "items" and "setItems" as props
function ItemsList({ items, setItems }) {

  // Declare "name" and "originalPrice" variables. These will be used to store the item's name and originalPrice.
  // The "useState" hook is used to create state variables, initial values are set to empty strings.
  const [name, setName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // Function to handle form submission when the "Add Item" button is clicked.
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!noWhiteSpace(name) || !noWhiteSpace(originalPrice)){
      return;
    }
    if(!quantity){
      setItems([...items, { name: name, originalPrice: originalPrice, quantity: 1, sharedPrice: 0, friends: [], isEdit: false }]);
    }
    else{
        setItems([...items, { name: name, originalPrice: originalPrice, quantity: quantity, sharedPrice: 0, friends: [], isEdit: false }]);
      }
    // Concatenate the current "name" and "originalPrice" to the existing "items" array and update the "items" state.
    // setItems(items.concat({ name, originalPrice, sharedPrice, }));

    // Reset the "name" and "originalPrice" state variables to empty strings after adding the item.
    setName("");
    setOriginalPrice("");
    setQuantity("");
  };

  // Render the UI components for the Bill Splitter app.
  return (
    <div className="item-container">
      <div className="item-list">
        <h1>List of Items</h1>
        <form onSubmit={handleSubmit}>
          {/* Input field for entering the item's name */}
          <input
            className="input-item"
            type="text"
            placeholder="Item"
            value={name}
            onChange={              
              (e) => {
              if(isValidInput(e.target.value)){
                setName(e.target.value)
              }
            }} // Update the "name" state variable when the input changes
          />
          {/* Input field for entering the item's originalPrice */}
          <input
            className="input-price"
            type="text"
            inputMode="decimal"
            placeholder="£"
            min="0"
            step="0.01"
            value={originalPrice}
            onChange={(e) => {
                if(isNumber(e.target.value)){
                  setOriginalPrice(e.target.value)
                }
              }} // Update the "price" state variable when the input changes
          />
          <input
            className="quantity"
            type="text"
            inputMode="numeric"
            placeholder="qty"
            min="0"
            step="1"
            value={quantity}
            onChange={(e)=>{
              if(isNumber(e.target.value)){
                setQuantity(e.target.value);
              }
            }}
          />
          {/* Button to add the item to the list */}
          <AddButton buttonName={"Add Items"} type={"submit"} />
        </form>

        {/* List to display the added items */}
        <div className="item-name-list">
          <ul>
            {items.map((item, index) =>
              // Each item in the "items" array is displayed as a list item with its name and originalPrice.
              {
                if (item.isEdit) {
                  return <EditItem Item={item} index={index} items={items} setItems={setItems}/>;
                } else {
                  return <Item Item={item} index={index} items={items} setItems={setItems} />;
                }
              }
            )}
          </ul>
        </div>
        <NextButton buttonName={"Next"} to={"/tax"} />
      </div>
    </div>
  );
}

// Export the BillSplitter component as the default export of this module.
export default ItemsList;
