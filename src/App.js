import React, { useState, useEffect } from 'react';
import ItemsList from './ItemList/ItemsList';
import FriendsList from './FriendsList/FriendsList';
import ItemSelection from './ItemSelection';
import EachOwed from './EachOwed';
import NavBar from './NavBar';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


/*

  ALL COMMENTS SHOULD NOT EXCEED LENGTH OF 100                                                     ¬

*/

/*
  Declaring a function consist of this structure
  "
    function {NameOfFunction} {

      return(

      );

    }

    export default {NameOfFunction}
  "

*/
function App() {

  /* 
    Declare bills and items variables with the "useState" to enable the use of states.
    The use of "useState" allows to read or get the variables with "bills" or "items".
    The use of "useState" also allows to write or set the variables with "setBills"
    or "setItems".
    The useState initial values are set as an empty array.
  */
  const [bills, setBills] = useState([]);
  const [items, setItems] = useState(() => {
    const storedItems = localStorage.getItem('my-items-list');
    return storedItems ? JSON.parse(storedItems) : [];
  });

  useEffect(() => {
    const storedItems = localStorage.getItem('my-items-list');
    if (storedItems) {
      setFriends(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('my-items-list', JSON.stringify(items));
  }, [items]);


  const [friends, setFriends] = useState(() => {
    const storedFriends = localStorage.getItem('my-friends-list');
    return storedFriends ? JSON.parse(storedFriends) : [];
  });

  useEffect(() => {
    const friendsStorage = localStorage.getItem('my-friends-list');
    if (friendsStorage) {
      setFriends(JSON.parse(friendsStorage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('my-friends-list', JSON.stringify(friends));
  }, [friends]);


  const initialCheckedState = Object.fromEntries(
    friends.map((friend) => [
      friend.name,
      Object.fromEntries(items.map((item) => [item.name, false])),
    ])
  );

  const [checked, setChecked] = useState(() => {
    const storedChecked = localStorage.getItem('my-check-list');
    return storedChecked ? JSON.parse(storedChecked) : Object.fromEntries(
      friends.map((friend) => [
        friend.name,
        Object.fromEntries(items.map((item) => [item.name, false])),
      ])
    );
  });

  useEffect(() => {
    const checkedStorage = localStorage.getItem('my-check-list');
    if (checkedStorage) {
      setChecked(JSON.parse(checkedStorage));
    }
  }, []);

  // Store checked state in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('my-check-list', JSON.stringify(checked));
  }, [checked]);


  return (
    /*
      Router tag here is to link all the different react components.
      It takes in a custom path and the element.
      Path is the directory to be linked to a specific react component.
      Element is to be given the react component with its input arguments. 

      Nav links are used to link the directories with buttons.
    */
<div className='container'>
    <div className='nav-app'>
      <NavBar />
    </div>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<FriendsList friends={friends} setFriends={setFriends} />} />
            <Route path="/item" element={<ItemsList items={items} setItems={setItems} />} />
            <Route path="/itemSelection" element={<ItemSelection bills={bills} setBills={setBills} items={items} setItems={setItems} friends={friends} setFriends={setFriends} checked={checked} setChecked={setChecked}/>} />
            <Route path="/eachOwed" element={<EachOwed items={items} setItems={setItems} friends={friends} setFriends={setFriends}/>} />
          </Routes>
        </div>
      </Router>
   </div>
  );
}

export default App;