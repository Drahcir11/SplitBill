import React, { useState } from 'react';
import NextButton from '../Button/NextPageButton';
import AddButton from '../Button/AddButton';
import './ItemsList.css'
import Item from './Item'
import EditItem from './EditItem';

// Function component called "BillSplitter" that takes "items" and "setItems" as props
function ItemsList({ items, setItems }) {

  // Declare "name" and "originalPrice" variables. These will be used to store the item's name and originalPrice.
  // The "useState" hook is used to create state variables, initial values are set to empty strings.
  const [name, setName] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');


  // Function to handle form submission when the "Add Item" button is clicked.
  const handleSubmit = (e) => {
    e.preventDefault();
  
    setItems([...items,{ name: name, originalPrice: originalPrice, sharedPrice: 0, friends:[], isEdit : false}])
  
    // Concatenate the current "name" and "originalPrice" to the existing "items" array and update the "items" state.
    // setItems(items.concat({ name, originalPrice, sharedPrice, }));
    
    // Reset the "name" and "originalPrice" state variables to empty strings after adding the item.
    setName('');
    setOriginalPrice('');
  };

  const deleteItem = (ItemInp) => {
    setItems(items.filter((ItemVal) => ItemVal.name !== ItemInp.name));
  }

  const editItem = (id) => {
    setItems(
      items.map((item,index) =>
        index === id ? { ...item, isEdit: !item.isEdit } : item
      )
    );
  };

  const editItemList = (name, originalPrice, id) => {
    setItems(
      items.map((item, index) =>
        index === id ? { ...item, name, originalPrice, isEdit: !item.isEdit } : item
      ));
  };

  // Render the UI components for the Bill Splitter app.
  return (
    <div className='item-container'>
      <div className='item-list'>
        <h1>List of Items</h1>
        <form onSubmit={handleSubmit}>
          {/* Input field for entering the item's name */}
          <input
            className='input-item'
            type="text"
            placeholder="Item"
            value={name}
            onChange={(e) => setName(e.target.value)} // Update the "name" state variable when the input changes
          />
          {/* Input field for entering the item's originalPrice */}
          <input
            className='input-price'
            type="number"
            placeholder="£"
            min="0"
            step="0.01"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)} // Update the "price" state variable when the input changes
          />
          {/* Button to add the item to the list */}
          {/* <button type="submit">Add Item</button> */}
          <AddButton buttonName={"Add Items"} type={"submit"}/>
        </form>
        
        {/* List to display the added items */}
        <div className='item-name-list'>
        <ul>
          {items.map((item, index) => 
            // Each item in the "items" array is displayed as a list item with its name and originalPrice.
            // <li key={index}> {item.name} - £{item.originalPrice}</li>
            {
              if(item.isEdit){
                return <EditItem Item={item} index={index} editItemList={editItemList} />
              } else {
                return <Item Item={item} index={index} deleteItem={deleteItem} editItem={editItem}/>
              }
            }
          )}
        </ul>
        </div>
        <NextButton buttonName={"Next"} to={"/tax"}/>
      </div>
    </div>
  );
}

// Export the BillSplitter component as the default export of this module.
export default ItemsList;
