import { useBillContext } from "../Hooks/useBillContext";
import NextButton from "../Button/NextPageButton";
import Divider from '@mui/material/Divider';
import "./ObjectItemSelection.css"
import formatMoney from "../utils/FormatMoney";

function ObjectItemSelection() {
    const { dispatch, listOfFriends, listOfItems, currency } = useBillContext();

    const handleClick = (e, friend, item) => {
        e.preventDefault();

        // When a friend has no selected item, insert the item
        if (friend.selectedItems.length < 1) {
            dispatch({ type: "INSERT_ITEM_INTO_FRIEND", payload: { itemObject: item, friendObject: friend } });
        } 
        // Remove selected item when a friend has already selected the item
        else if (friend.selectedItems.includes(item.itemId)) {
            dispatch({ type: "REMOVE_ITEM_FROM_FRIEND", payload: { itemObject: item, friendObject: friend } });
        } 
        // Otherwise insert item
        else {
            dispatch({ type: "INSERT_ITEM_INTO_FRIEND", payload: { itemObject: item, friendObject: friend} });
        }
    };

    const handleSubmit = () => {
        dispatch({ type: "SPLIT_BILL"})
    };

    return (
        <div className="item-selection">
            <div>
                <h1
                    style={{
                        fontSize: "36px",
                        fontWeight: "1000",
                        marginBlockEnd: "0px",
                        marginBlockStart: "32px",
                        color: "white",
                        textShadow: "2px 2px black",
                    }}
                >
                    SELECT ITEMS
                </h1>
                <h5 style={{ fontWeight: "700", fontSize: "12px", marginBlockStart: "0px", marginBlockEnd: "24px", color: "black" }}>
                    Be honest and select items that you ate.
                </h5>

            </div>
            <form className="friends-items">
                {/* Map through the "bills" array to display each friend's bill */}
                {listOfFriends.map((friend, friendIndex) => (
                    <div
                        className="friend-container"
                        key={friendIndex}
                        style={{ backgroundColor: "White", display: "flex", flexDirection: "column", boxShadow: "4px 2px black", marginBottom:"32px" }}
                    >
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            {/* Display the friend's name as the subheading */}
                            <h4
                                className="friendName"
                                style={{
                                    marginBlockStart: "0px",
                                    fontWeight: "1000",
                                    color: "black",
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
                                } else if (friend.selectedItems.includes(item.itemId)) {
                                    isItemChecked = true;
                                }

                                return (
                                    <div
                                        key={item.itemId}
                                        className={`itemSelection ${isItemChecked ? "selected" : ""}`}
                                        onClick={(e) => {
                                            handleClick(e, friend, item);
                                        }}
                                        style={{
                                            fontSize: "12px",
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            paddingTop: "0px",
                                            paddingBottom: "0px",
                                        }}
                                    >
                                        <div className="item-selection__item-name-container">
                                            <p className="item-selection__item-name-paragraph"> {item.name}</p>
                                        </div>
                                        <Divider orientation="vertical" variant="middle" flexItem />
                                        <div className="item-selection__item-quantity">
                                            <p> {item.quantity} <span style={{ fontSize: "0.7em"}}>pc</span></p>
                                        </div>
                                        <Divider orientation="vertical" variant="middle" flexItem />
                                        <div className="item-selection__item-unit-price-container">
                                            <p className="item-selection__item-unit-price-paragraph">
                                                {currency}{formatMoney(item.unitPrice)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </form>
            <NextButton buttonName={"< NEXT PAGE >"} to={"/eachOwed"} clickEvent={handleSubmit} />
        </div>
    );
}

export default ObjectItemSelection;
