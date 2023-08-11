import React, { useState } from 'react';

function EditItem({Item, index, editItemList}) {
    const [value, setValue] = useState(Item.name)
    const [price, setPrice] = useState(Item.originalPrice)

    const handleSubmit = (e) => {
        // prevent default action
        e.preventDefault();
        editItemList(value, price, index)
        };

    return (
        <form onSubmit={handleSubmit}>
            {/* Input field for entering the item's name */}
            <input
            className='input-item'
            type="text"
            placeholder="Item"
            value={value}
            onChange={(e) => setValue(e.target.value)} // Update the "name" state variable when the input changes
            />
            {/* Input field for entering the item's originalPrice */}
            <input
            className='input-price'
            type="number"
            placeholder="£"
            value={price}
            onChange={(e) => setPrice(e.target.value)} // Update the "price" state variable when the input changes
            />
            {/* Button to add the item to the list */}
            <button type="submit">Add Item</button>
        </form>
    );
}

export default EditItem;