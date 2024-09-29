import React, { useState } from "react";
import NextButton from "../Button/NextPageButton";
import { Link } from "react-router-dom";
import AddButton from "../Button/AddButton";
import Friends from "./Friends";
import ObjectFriend from "./ObjectFriend";
import EditObjectFriend from "./EditObjectFriend";
import "./FriendsList.css";
import EditFriends from "./EditFriends";
import { isValidInput, noWhiteSpace } from "../ErrorHandling";
import { useBillContext } from "../Hooks/useBillContext";


function FriendsList({ friends, setFriends }) {
    const { dispatch, listOfFriends } = useBillContext();
    const [friendName, setFriendName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!noWhiteSpace(friendName)) {
            return;
        }

        dispatch({ type: "ADD_FRIEND", payload: friendName });

        setFriendName("");
        setFriends([...friends, { name: friendName, items: [], total: 0, isEdit: false }]);
        setFriendName("");

        console.log("list of friends :", listOfFriends);
    };

    const deleteTodo = (inputFriend) => {
        setFriends(friends.filter((friend) => friend.name !== inputFriend.name));
    };

    const deleteFriend = (friend_id) => {
        dispatch({type: "REMOVE_FRIEND", payload: friend_id})
    };

    const editFriend = (inputId) => {
        setFriends(friends.map((friend, index) => (index === inputId ? { ...friend, isEdit: !friend.isEdit } : friend)));
    };

    const editFriendList = (inputName, inputId) => {
        setFriends(friends.map((friend, index) => (index === inputId ? { ...friend, name: inputName, isEdit: !friend.isEdit } : friend)));
    };

    return (
        <>
            <div className="friends-list">
                <div
                    style={{
                        width: "85%",
                        maxWidth: "420px",
                    }}
                >
                    <div
                        className="heading"
                        style={{
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <h1>FRIENDS</h1>
                        <div style={{ width: "85%", textAlign: "center", textJustify: "center", marginTop: "4px", marginBottom: "24px" }}>
                            <h5
                                style={{
                                    fontStyle: "sans-serif",
                                    fontWeight: "700",
                                    fontSize: "12px",
                                    marginBlockStart: "8px",
                                    marginBlockEnd: "8px",
                                    color: "black",
                                    textAlign: "center",
                                    // color: "#5c5c5c",
                                }}
                            >
                                Add your list of friend's names here.
                            </h5>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="input-container">
                            <input
                                type="text"
                                value={friendName}
                                placeholder=" e.g. Karen"
                                onChange={(e) => {
                                    if (isValidInput(e.target.value)) {
                                        setFriendName(e.target.value);
                                    }
                                }}
                                // minLength={0}
                                maxLength={50} //restricts User name input to 50 characters
                                style={{
                                    boxShadow: "4px 4px",
                                    borderColor: "black",
                                }}
                            />
                            <AddButton buttonName={"+"} type={"submit"} />
                        </div>
                    </form>
                    <div className="name-list">
                        <ol>
                            {friends.map((friend, index) => {
                                if (friend.isEdit) {
                                    return <EditFriends friend={friend} index={index} deleteTodo={deleteTodo} editFriend={editFriendList} />;
                                } else {
                                    return <Friends friend={friend} index={index} deleteTodo={deleteTodo} editFriend={editFriend} />;
                                }
                            })}
                        </ol>
                        <ol>
                            {listOfFriends.map((friend, index) => {
                                
                                if (friend.isEdit) {
                                    return < EditObjectFriend friend={friend}/>
                                }
                                else {
                                    return <ObjectFriend friend={friend} deleteFriend={deleteFriend} editFriend={editFriend} />
                                }
                            })}
                        </ol>
                    </div>
                    <div
                        className="button-container"
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <NextButton buttonName={"< NEXT PAGE >"} to={"/ReceiptCapture"} />
                        <p
                            style={{
                                fontSize: "8px",
                            }}
                        >
                            Manually add items
                            <Link to="/item">
                                <span style={{ textDecoration: "underline" }}> click here</span>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FriendsList;
