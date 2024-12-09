import React, { useState } from "react";
import NextButton from "../Button/NextPageButton";
import { Link } from "react-router-dom";
import AddButton from "../Button/AddButton";
import ObjectFriend from "./ObjectFriend";
import "./FriendsList.css";
import { isValidInput, noWhiteSpace } from "../ErrorHandling";
import { useBillContext } from "../Hooks/useBillContext";


function FriendsList() {
    const { dispatch, listOfFriends } = useBillContext();
    const [friendName, setFriendName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!noWhiteSpace(friendName)) {
            return;
        }

        dispatch({ type: "ADD_FRIEND", payload: friendName });
        setFriendName("");
    };

    return (
        <div className="friends-list__container">
                <div className="friends-list__text-content">
                    <h1 className="friends-list__title">FRIENDS</h1>
                    <h5 className="friends-list__heading">
                        Add your list of friend's names here.
                    </h5>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="friends-list__input-form">
                        <input
                            type="text"
                            value={friendName}
                            placeholder=" e.g. Karen"
                            onChange={(e) => {
                                if (isValidInput(e.target.value)) {
                                    setFriendName(e.target.value);
                                }
                            }}
                            maxLength={50} //restricts User name input to 50 characters
                        />
                        <AddButton buttonName={"+"} type={"submit"} />
                    </div>
                </form>
                <div className="friends-list__friends-name">
                    <ol>
                        {listOfFriends.map((friend, index) => {
                            return <ObjectFriend key={index} friend={friend} />
                        })}
                    </ol>
                </div>
                <div className="friends-list__button-container">
                    <NextButton buttonName={"< NEXT PAGE >"} to={"/ReceiptCapture"} />
                    {/* <p>
                        Manually add items
                        <Link to="/item">
                            <span style={{ textDecoration: "underline" }}> click here </span>
                        </Link>
                    </p> */}
                </div>
        </div>
    );
}

export default FriendsList;
