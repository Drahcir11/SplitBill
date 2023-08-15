import React, { useState, useEffect } from 'react';
import NextButton from '../Button/NextPageButton';

import AddButton from '../Button/AddButton';
import Friends from './Friends';
import './FriendsList.css'
import EditFriends from './EditFriends'
import { isValidInput, noWhiteSpace } from '../ErrorHandling';

function FriendsList({ friends, setFriends }) {
  const [friendName, setFriendName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();    
    if (!noWhiteSpace(friendName)){
      return;
    }
    setFriendName('');
    setFriends([...friends,{ name:friendName, items:[],total: 0, isEdit: false}]);
    setFriendName('');
  };
  
  const deleteTodo = (friend) => {
    setFriends(friends.filter((friendval) => friendval.name !== friend.name));
  };
  
  const editFriend = (id) => {
    setFriends(
      friends.map((friend,index) =>
        index === id ? { ...friend, isEdit: !friend.isEdit } : friend
      )
    );
  };

  const editFriendList = (name, id) => {
    setFriends(
      friends.map((friend, index) =>
        index === id ? { ...friend, name, isEdit: !friend.isEdit } : friend
      ));
  };

  return (
    <>
      <div className='friends-list'>
        <h1>List of victims</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              value={friendName}
              placeholder="Name"
              onChange={(e) => {
                if (isValidInput(e.target.value)) { 
                  setFriendName(e.target.value);
                }
              }}
              // minLength={0}
              maxLength={50} //restricts User name input to 50 characters
            />
            <AddButton buttonName={"Add Victims😈"} type={"submit"}/>
          </div>
        </form>
        <div className='name-list'>
          <ol>
            {friends.map((friend, index) => {
                if(friend.isEdit){
                  return <EditFriends friend={friend} index={index} deleteTodo={deleteTodo} editFriend={editFriendList} />
                } else {
                  return <Friends friend={friend} index={index} deleteTodo={deleteTodo} editFriend={editFriend}/>
                }
              }
            )}
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
