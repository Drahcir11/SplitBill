import React, { useEffect, useState } from "react";
import NextButton from "../Button/NextPageButton";
import AddButton from "../Button/AddButton";
import "./ItemsList.css";
import Item from "./Item";
import ObjectItem from "./ObjectItem";
import EditItem from "./EditItem";
import { isNumber, isValidInput, noWhiteSpace } from "../ErrorHandling";
import { useBillContext } from "../Hooks/useBillContext";

// Function component called "BillSplitter" that takes "items" and "setItems" as props
function ItemsList({ items, setItems }) {
    const { dispatch, listOfItems } = useBillContext();

    // Declare "name" and "originalPrice" variables. These will be used to store the item's name and originalPrice.
    // The "useState" hook is used to create state variables, initial values are set to empty strings.
    const [name, setName] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [subTotal, setSubTotal] = useState(0.0);

    // Function to handle form submission when the "Add Item" button is clicked.
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!noWhiteSpace(name) || !noWhiteSpace(originalPrice)) {
            return;
        }
        if (!quantity) {
            dispatch({ type: "ADD_ITEM", payload: { itemName: name, unitPrice: originalPrice, quantity: 1 } });
            setItems([
                ...items,
                {
                    name: name,
                    originalPrice: originalPrice,
                    quantity: 1,
                    sharedPrice: 0,
                    friends: [],
                    isEdit: false,
                },
            ]);
        } else {
            dispatch({ type: "ADD_ITEM", payload: { itemName: name, unitPrice: originalPrice, quantity: quantity } });
            setItems([
                ...items,
                {
                    name: name,
                    originalPrice: originalPrice,
                    quantity: quantity,
                    sharedPrice: 0,
                    friends: [],
                    isEdit: false,
                },
            ]);
        }
        // Concatenate the current "name" and "originalPrice" to the existing "items" array and update the "items" state.
        // setItems(items.concat({ name, originalPrice, sharedPrice, }));

        // Reset the "name" and "originalPrice" state variables to empty strings after adding the item.
        setName("");
        setOriginalPrice("");
        setQuantity("");
    };

    useEffect(() => {
        const listOfItems = items;
        let tempSubTotal = 0.0;
        listOfItems.forEach((item) => {
            tempSubTotal += item.originalPrice * item.quantity;
        });
        setSubTotal(tempSubTotal.toFixed(2));
    }, [items]);

    // Render the UI components for the Bill Splitter app.
    return (
        <div className="item-container">
            <div className="item-list">
                <h1 style={{ fontSize: "36px", marginBlockEnd: "0px", marginBlockStart: "48px", color: "white", textShadow: "2px 2px black" }}>
                    ITEMS
                </h1>
                <h5 style={{ fontWeight: "700", fontSize: "12px", marginBlockStart: "0px", marginBlockEnd: "24px", color: "black" }}>
                    Add the list of purchased food items per unit price.
                </h5>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        // width: "100vh"
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <div
                                className="input-container-maybe"
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    textAlign: "center",
                                    backgroundColor: "white",
                                    borderWidth: "2.5px",
                                    borderColor: "black",
                                    borderStyle: "solid",
                                    height: "3em",
                                    marginRight: "10px",
                                    borderRadius: "8px",
                                    boxShadow: "4px 4px",
                                    width: "90%",
                                }}
                            >
                                {/* Input field for entering the item's name */}
                                <input
                                    className="input-item"
                                    type="text"
                                    placeholder="e.g. Salmon Sashimi"
                                    value={name}
                                    maxLength="28"
                                    onChange={(e) => {
                                        if (isValidInput(e.target.value)) {
                                            setName(e.target.value);
                                        }
                                    }}
                                    style={{
                                        outline: "none",
                                        backgroundColor: "transparent",
                                        borderColor: "transparent",
                                    }}
                                />
                                {/* Input field for entering the item's originalPrice */}
                                <input
                                    className="input-price"
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="£ 12.50"
                                    min="0"
                                    step="0.01"
                                    value={originalPrice}
                                    onChange={(e) => {
                                        if (isNumber(e.target.value)) {
                                            setOriginalPrice(e.target.value);
                                        }
                                    }}
                                    style={{
                                        outline: "none",
                                        backgroundColor: "transparent",
                                        borderColor: "transparent",
                                    }}
                                />
                                <input
                                    className="quantity"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="qty"
                                    min="0"
                                    step="1"
                                    value={quantity}
                                    onChange={(e) => {
                                        if (isNumber(e.target.value)) {
                                            setQuantity(e.target.value);
                                        }
                                    }}
                                    style={{
                                        outline: "none",
                                        backgroundColor: "transparent",
                                        borderColor: "transparent",
                                    }}
                                />
                            </div>
                            {/* Button to add the item to the list */}
                            <AddButton buttonName={"+"} type={"submit"} />
                        </div>
                    </form>
                </div>
                {items && (
                    <div
                        style={{
                            marginTop: "16px",
                            marginBottom: "16px",
                            border: "2px solid",
                            borderRadius: "16px",
                            fontWeight: "500",
                            backgroundColor: "#fff",
                            fontSize: "12px",
                            width: "100%",
                            maxWidth: "357px",
                            paddingRight: "16px",
                            paddingLeft: "10px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <p style={{ fontWeight: "700" }}>Sub total: </p>
                        <p style={{ fontSize: "12px", fontWeight: "700" }}>
                            £{subTotal}
                            <span style={{ fontSize: "8px", fontWeight: "500" }}> (excl tax)</span>
                        </p>
                    </div>
                )}

                {/* List to display the added items */}
                <div className="item-name-list">
                    {/* <ul>
                        {items.map((item, index) =>
                            // Each item in the "items" array is displayed as a list item with its name and originalPrice.
                            {
                                if (item.isEdit) {
                                    return <EditItem Item={item} index={index} items={items} setItems={setItems} />;
                                } else {
                                    return <Item Item={item} index={index} items={items} setItems={setItems} />;
                                }
                            }
                        )}
                    </ul> */}
                    <ul>
                        {listOfItems.map((item, index) => {
                            return <ObjectItem Item={item} />;
                        })}
                    </ul>
                </div>
                <NextButton buttonName={"< NEXT PAGE >"} to={"/ObjectItemSelection"} />
            </div>
        </div>
    );
}

// Export the BillSplitter component as the default export of this module.
export default ItemsList;
