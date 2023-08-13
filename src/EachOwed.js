import React from 'react';
import NextButton from './Button/NextPageButton';

function EachOwed ({items, setItems, friends, setFriends}) {
    // On clicking restart, clear out local storage of item and friends data
    const handleRestart = () => {
        setItems([]);
        setFriends([]);
    }

    return(
        <div>
            <h1> How much individually people owe</h1>
            <ul>
                {friends.map((friend,index) => (
                    <li key={index}> {friend.name} owes £{friend.total}</li>
                ))}
            </ul>
            <NextButton buttonName={"Restart"} to={"/"} clickEvent={handleRestart}/>
        </div>

    );
};

export default EachOwed;