import "./ItemsList.css";

import { useState } from "react";
import { useBillContext } from "../Hooks/useBillContext";
import { isNumber, isValidInput, noWhiteSpace } from "../ErrorHandling";
import ObjectItem from "./ObjectItem";
import AddButton from "../Button/AddButton";

function ItemsList() {
    const { dispatch, listOfItems, itemSubTotalCost, currency } = useBillContext();

    const itemEntryPlaceholder = ` ${currency} 12.50`

    const [itemName, setItemName] = useState("");
    const [itemUnitPrice, setItemUnitPrice] = useState("");
    const [itemQuantity, setItemQuantity] = useState("");

    const handleItemSubmit = (e) => {
        e.preventDefault();

        // Do nothing when item name and unit price is empty string
        if (!noWhiteSpace(itemName) || !noWhiteSpace(itemUnitPrice)) {
            return;
        }

        // Default to adding item with qty 1 when qty is not specified
        if (!itemQuantity) {
            dispatch({ type: "ADD_ITEM", payload: { itemName: itemName, unitPrice: itemUnitPrice, quantity: 1 } });
        } else {
            dispatch({ type: "ADD_ITEM", payload: { itemName: itemName, unitPrice: itemUnitPrice, quantity: itemQuantity } });
        }

        // Reset input item properties
        setItemName("");
        setItemUnitPrice("");
        setItemQuantity("");
    };

    return (
        <div className="items-list__container">
            <h1>ITEMS</h1>
            <h5>Add the list of purchased food items per unit price.</h5>
            <form onSubmit={handleItemSubmit}>
                <div className="items-list__input-form-item">
                    {/* Input field for entering the item's name */}
                    <input
                        className="items-list__input-item-name"
                        type="text"
                        placeholder="e.g. Salmon Sashimi"
                        value={itemName}
                        maxLength="28"
                        onChange={(e) => {
                            if (isValidInput(e.target.value)) {
                                setItemName(e.target.value);
                            }
                        }}
                    />
                    {/* Input field for entering the item's unit price */}
                    <input
                        className="items-list__input-item-unit-price"
                        type="text"
                        inputMode="decimal"
                        placeholder= {itemEntryPlaceholder}
                        min="0"
                        step="0.01"
                        value={itemUnitPrice}
                        onChange={(e) => {
                            if (isNumber(e.target.value)) {
                                setItemUnitPrice(e.target.value);
                            }
                        }}
                    />
                    {/* Input field for entering the item's quantity */}
                    <input
                        className="items-list__input-item-quantity"
                        type="text"
                        inputMode="numeric"
                        placeholder="qty"
                        min="0"
                        step="1"
                        value={itemQuantity}
                        onChange={(e) => {
                            if (isNumber(e.target.value)) {
                                setItemQuantity(e.target.value);
                            }
                        }}
                    />
                </div>
                <AddButton buttonName={"+"} type={"submit"} />
            </form>
            <div className="items-list__item-sub-total">
                <p>Sub total: </p>
                <p>
                    {currency}{itemSubTotalCost}
                    <span style={{ fontSize: "8px", fontWeight: "500" }}> (excl tax)</span>
                </p>
            </div>
            <div className="items-list__item-name-list">
                <ul>
                    {listOfItems.map((item, index) => {
                        return <ObjectItem key={index} Item={item} />;
                    })}
                </ul>
            </div>
        </div>
    );
}

export default ItemsList;
