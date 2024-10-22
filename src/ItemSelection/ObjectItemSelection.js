import React, { useEffect } from "react";
import { useBillContext } from "../Hooks/useBillContext";

function ObjectItemSelection() {
    const { dispatch, listOfFriends, listOfItems } = useBillContext();

    const handleClick = (e, friend, item) => {
        e.preventDefault();

        if (friend.selectedItems.length < 1) {
            dispatch({ type: "INSERT_ITEM_INTO_FRIEND", payload: { itemObject: item, friendId: friend.personId } });
        } else if (friend.selectedItems.some(itemObject => itemObject.itemId === item.itemId)) {
            dispatch({ type: "REMOVE_ITEM_FROM_FRIEND", payload: { targetItemId: item.itemId, friendId: friend.personId } });
        } else {
            dispatch({ type: "INSERT_ITEM_INTO_FRIEND", payload: { itemObject: item, friendId: friend.personId } });
        }
    };

    const handleSubmit = () => {

    }

    return (
        <form className="friends-items">
            {/* Map through the "bills" array to display each friend's bill */}
            {listOfFriends.map((friend, friendIndex) => (
                <div
                    className="friend-container"
                    key={friendIndex}
                    style={{ backgroundColor: "White", display: "flex", flexDirection: "column", boxShadow: "4px 2px black" }}
                >
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        {/* Display the friend's name as the subheading */}
                        <h4
                            className="friendName"
                            style={{
                                marginBlockStart: "0px",
                            }}
                        >
                            {friend.name}
                        </h4>
                    </div>
                    <div className="items-per-friend">
                        {/* Map through the "items" array to display each item with a checkbox */}
                        {listOfItems.map((item, itemIndex) => {
                            // Start by checking if the checked state for this friend and item exists
                            let isItemChecked = false;
                            if (friend.selectedItems.length < 1) {
                                isItemChecked = false;
                            } else if (friend.selectedItems.some(itemObject => itemObject.itemId === item.itemId)) {
                                isItemChecked = true;
                            }

                            // if (checked[friend.name] && checked[friend.name][item.name] !== undefined) {
                            //     // If it does exist, use that state to determine if the checkbox is checked
                            //     isItemChecked = checked[friend.name][item.name];
                            // }

                            // let isSelected = checked[friend.name] && checked[friend.name][item.name];

                            return (
                                <div
                                    key={item.name}
                                    className={`itemSelection ${isItemChecked ? "selected" : ""}`}
                                    onClick={(e) => {
                                        handleClick(e, friend, item);
                                    }}
                                    style={{
                                        fontSize: "12px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        paddingTop: "0px",
                                        paddingBottom: "0px",
                                    }}
                                >
                                    <p> {item.name}</p>
                                    <p> £{item.unitPrice}</p>
                                    {/* {item.name} - £{item.originalPrice} */}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </form>
    );
}

export default ObjectItemSelection;
