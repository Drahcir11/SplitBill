import React, { useState } from 'react';
import NextButton from './NextPageButton';
import AddButton from './Button/AddButton';
import Friends from './FriendsList/Friends';
import './FriendsList.css'

function FriendsList({ friends, setFriends }) {
  const [friendName, setFriendName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFriendName('');
    setFriends([...friends,{ name:friendName, items:[],total: 0}]);
    setFriendName('');
  };


  const deleteTodo = (friend) => setFriends(friends.filter((friendval) => friendval.name !== friend.name));

  return (
    <>
      <div className='friends-list'>
        <h1>List of victims</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
            />
            <AddButton buttonName={"Add Victims😈"} type={"submit"}/>
          </div>
        </form>
        <div className='name-list'>
          <ol>
            {friends.map((friend, index) => (

              <Friends friend={friend} index={index} deleteTodo={deleteTodo}/>
            ))}
          </ol>
        </div>
        <div className='button-container'>
          <NextButton buttonName={"Next"} to={"/item"}/>
        </div>
      </div>
    </>
  );
}


export default FriendsList;
