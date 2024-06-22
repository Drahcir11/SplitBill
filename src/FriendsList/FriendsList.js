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
  
  const deleteTodo = (inputFriend) => {
    setFriends(friends.filter((friend) => friend.name !== inputFriend.name));
  };
  
  const editFriend = (inputId) => {
    setFriends(
      friends.map((friend,index) =>
        index === inputId ? { ...friend, isEdit: !friend.isEdit } : friend
      )
    );
  };

  const editFriendList = (inputName, inputId) => {
    setFriends(
      friends.map((friend, index) =>
        index === inputId ? { ...friend, name : inputName, isEdit: !friend.isEdit } : friend
      ));
  };

  return (
    <>
      <div className='friends-list'>
        <div style={{
          width:"85%",
          maxWidth: "420px",
        }}> 
          <div style={{
            textAlign: "center"
          }}>
            <h1 style={{fontSize: "24px", fontWeight: "700", marginBlockEnd: "0px", marginBlockStart: "48px"}}>Friends</h1>
            <h5 style={{fontWeight: "500", fontSize: "12px", marginBlockStart:"0px", marginBlockEnd: "24px",  
              // color: "black",
              color: "#5c5c5c"
              }}> 
            Add your list of friend's names here.
            </h5>

          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                type="text"
                value={friendName}
                placeholder=" e.g. Karen"
                onChange={
                  (e) => {
                    if (isValidInput(e.target.value)) { 
                      setFriendName(e.target.value);
                    }
                    }}
                    // minLength={0}
                    maxLength={50} //restricts User name input to 50 characters
                    />
              <AddButton buttonName={"Add"} type={"submit"}/>
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
              })}
          </ol>
        </div>
        <div className='button-container'>
          <NextButton buttonName={"Next"} to={"/ReceiptCapture"}/>
        </div>
        </div>
      </div>
    </>
  );
}


export default FriendsList;
