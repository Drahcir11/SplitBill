import React, { useState } from "react";
import EditButton from "../Button/EditButton";
import { isNumber, isValidInput, noWhiteSpace } from "../ErrorHandling";

function EditItem({ Item, index, editItemList }) {
  const [value, setValue] = useState(Item.name);
  const [price, setPrice] = useState(Item.originalPrice);

  const handleSubmit = (e) => {
    // prevent default action
    e.preventDefault();
    if(!noWhiteSpace(value) || !noWhiteSpace(price)){
      return;
    }
    editItemList(value, price, index);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input field for entering the item's name */}
      <input
        className="input-item"
        type="text"
        placeholder="Item"
        value={value}
        onChange={(e) => 
          {
            if(isValidInput(e.target.value)){
              setValue(e.target.value)
            }
          }} // Update the "name" state variable when the input changes
      />
      {/* Input field for entering the item's originalPrice */}
      <input
        className="input-price"
        type="text"
        inputMode="numeric"
        placeholder="£"
        min="0"
        step="0.01"
        value={price}
        onChange={(e) => 
          {
            if(isNumber(e.target.value)){
              setPrice(e.target.value)
            }
          }} // Update the "price" state variable when the input changes
      />
      {/* Button to add the item to the list */}
      <EditButton buttonName={"Update"} type={"submit"} />
    </form>
  );
}

export default EditItem;
