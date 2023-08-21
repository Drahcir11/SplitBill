import React from 'react';
import NextButton from './Button/NextPageButton';
import'./EachOwed.css'

function EachOwed ({items, setItems, friends, setFriends, setChecked}) {
    // On clicking restart, clear out local storage of item and friends data
    const handleRestart = () => {
        setItems([]);
        setFriends([]);
        setChecked([]);

    }

    return(
        <div className='each-owed'>
            <h2> How much individually people owe</h2>
            <ul>
                {friends.map((friend,index) => (
                    <li key={index}> {friend.name} owes £{Math.round(friend.total*100)/100}</li>
                ))}
            </ul>
            <NextButton buttonName={"Restart"} to={"/"} clickEvent={handleRestart}/>
        </div>

    );
};

export default EachOwed;