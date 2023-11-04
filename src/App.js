import React, { useState, useEffect } from "react";
import TaxList from "./TaxList/Tax";
import ItemsList from "./ItemList/ItemsList";
import FriendsList from "./FriendsList/FriendsList";
import ItemSelection from "./ItemSelection/ItemSelection";
import EachOwed from "./EachOwed";
import NavBar from "./NavBar";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

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

  // const[items, setItems] = useState([]);

  const [items, setItems] = useState(() => {
    const storedItems = sessionStorage.getItem("my-items-list");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  useEffect(() => {
    sessionStorage.setItem("my-items-list", JSON.stringify(items));
  }, [items]);

  const [friends, setFriends] = useState(() => {
    const storedFriends = sessionStorage.getItem("my-friends-list");
    return storedFriends ? JSON.parse(storedFriends) : [];
  });

  useEffect(() => {
    sessionStorage.setItem("my-friends-list", JSON.stringify(friends));
  }, [friends]);

  const [tax, setTax] = useState(() => {
    const storedTax = sessionStorage.getItem("my-tax-list");
    return storedTax ? JSON.parse(storedTax) : [];
  });

  useEffect(() => {
    sessionStorage.setItem("my-tax-list", JSON.stringify(tax));
  }, [tax]);

  const [checked, setChecked] = useState(() => {
    const storedChecked = sessionStorage.getItem("my-check-list");
    return storedChecked
      ? JSON.parse(storedChecked)
      : Object.fromEntries(friends.map((friend) => [friend.name, Object.fromEntries(items.map((item) => [item.name, false]))]));
  });

  // Store checked state in sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("my-check-list", JSON.stringify(checked));
  }, [checked]);

  const itemSelectionProps = {
    tax,
    setTax,
    items,
    setItems,
    friends,
    setFriends,
    checked,
    setChecked,
  };

  return (
    /*
      Router tag here is to link all the different react components.
      It takes in a custom path and the element.
      Path is the directory to be linked to a specific react component.
      Element is to be given the react component with its input arguments. 

      Nav links are used to link the directories with buttons.
    */
    <div className="container">
      <div className="nav-app">
        <NavBar />
      </div>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<FriendsList friends={friends} setFriends={setFriends} />} />
            <Route path="/item" element={<ItemsList items={items} setItems={setItems} tax={tax} setTax={setTax} />} />
            <Route path="/tax" element={<TaxList tax={tax} setTax={setTax} />} />
            <Route path="/itemSelection" element={<ItemSelection props={itemSelectionProps} />} />
            <Route path="/eachOwed" element={<EachOwed setItems={setItems} friends={friends} setFriends={setFriends} setChecked={setChecked} />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
