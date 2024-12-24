import React from "react";
import "./HowTo.css";
import NextButton from "../Button/NextPageButton";

function HowTo() {
    return (
        <div
            className="how-container"
            style={{ width: "95vw", maxWidth: "420px", height: "100%", minHeight: "100vh",
                alignItems: "center", justifyItems: "center", fontFamily: "sans-serif", padding: "0px 5px 0px 5px" }}
        >
            <div style={{ textAlign: "center" }}>
                <h1 style={{ fontSize: "2em", fontWeight: "1000", textShadow: "2px 2px black", color: "white" }}>USER TUTORIAL</h1>
            </div>
            <div style={{marginBottom: "32px", textAlign:"left", color:"black"}}>
                <p>This section will discuss how to start splitting your food bills fairly amongst your friends, none of that:
                </p>
                <p><b>"Split the bill equally for everyone"</b>.</p>
                <p> The 3 main steps are listed below:</p>
            </div>
            <div className="add-friends-tutorial">
                <div style={{ marginBottom: "52px" }}>
                    <h2 style={{ textAlign: "left", textJustify: "center", fontSize: "1em", fontWeight: "700", color: "black" }}>
                        {" "}
                        1. Add Friends{" "}
                    </h2>
                    <h5 style={{ fontSize: "0.9em", fontWeight: "400", textAlign: "left", color: "black", }}>
                        Add your friends by simply entering names into the input box. Click on the entered names to make changes.
                    </h5>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <img
                            src="./add_friends_names.gif"
                            style={{ border: "2px solid black", borderRadius: "8px", width: "100%", maxWidth: "50vw" }}
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
            <div className="receipt-capture-tutorial">
                <div style={{ marginBottom: "52px" }}>
                    <h2 style={{ textAlign: "left", textJustify: "center", fontSize: "1em", fontWeight: "700", color: "black" }}>
                        {" "}
                        2.1 Capture Receipts{" "}
                    </h2>
                    <h5 style={{ fontSize: "0.9em", fontWeight: "400", textAlign: "left", color: "black" }}>
                        Simply upload a food receipt bill, and adjust the crop box to only include the item names 
                        & prices.
                        <p>Finally press the <b>CROP IMAGE</b> button to extract item names and prices</p>
                    </h5>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <img
                            src="./receipt_capture_demo.gif"
                            style={{ border: "2px solid black", borderRadius: "8px", width: "100%", maxWidth: "50vw" }}
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
            <div className="add-items-tutorial">
                <div style={{ marginBottom: "52px" }}>
                    <h2 style={{ textAlign: "left", textJustify: "center", fontSize: "1em", fontWeight: "700", color: "black" }}>
                        {" "}
                        2.2 Add Items{" "}
                    </h2>
                    <h5 style={{ fontSize: "0.9em", fontWeight: "400", textAlign: "left", color: "black" }}>
                        Enter an item name, price, and quantity to manually add items. Click on the entered item's
                        name to make changes, similarly to the item price.
                        <p>Press <b>+</b> or <b>-</b> to add or subtract the item's quantity</p>
                    </h5>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <img
                            src="./add_items_demo.gif"
                            style={{ border: "2px solid black", borderRadius: "8px", width: "100%", maxWidth: "50vw" }}
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
            <div className="item-selection-tutorial">
                <div style={{ marginBottom: "52px" }}>
                    <h2 style={{ textAlign: "left", textJustify: "center", fontSize: "1em", fontWeight: "700", color: "black" }}>
                        {" "}
                        3. Items Selection{" "}
                    </h2>
                    <h5 style={{ fontSize: "0.9em", fontWeight: "400", textAlign: "left", color: "black" }}>
                        Each friend will need to select each food items that they've consumed. Once everyone
                        has selected, continue to the next page to see everyone's breakdown.
                    </h5>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <img
                            src="./item_selection_demo.gif"
                            style={{ border: "2px solid black", borderRadius: "8px", width: "100%", maxWidth: "50vw" }}
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
            <div style={{display:"flex", alignItems:"center", justifyContent:"center",
                marginBottom:"32px"
            }}>

            <NextButton buttonName={"< START SPLIT >"} to={"/"} />
            </div>
        </div>
    );
}

export default HowTo;
