import React from 'react';
import NextButton from './Button/NextPageButton';

function EachOwed ({items, setItems, friends, setFriends}) {

    return(
        <div>
            <h1> How much individually people owe</h1>
            <ul>
                {friends.map((friend,index) => (
                    <li key={index}> {friend.name} owes £{friend.total}</li>
                ))}
            </ul>
            <NextButton buttonName={"Restart"} to={"/"}/>
        </div>

    );
};

export default EachOwed;