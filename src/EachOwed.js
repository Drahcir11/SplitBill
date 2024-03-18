import {useEffect, useState} from "react";
import NextButton from "./Button/NextPageButton";
import "./EachOwed.css";
import Decimal from 'decimal.js';

function EachOwed({ items, setItems, friends, setFriends, setChecked }) {

  // On clicking restart, clear out local storage of item and friends data
  const handleRestart = () => {
    setItems([]);
    setFriends([]);
    setChecked([]);
  };

  const [totalBill, setTotalBill] = useState('');

  useEffect(()=>{
    const getTotalBill = () => {
      let totalBill = new Decimal('0');
      for(const index in items){
        // console.log("total bill :" + JSON.stringify(items[index]));

        let itemPrice = new Decimal(items[index]["priceWithTax"])
        totalBill = totalBill.plus(itemPrice)

        // totalBill += items[index]["priceWithTax"]
      }
      setTotalBill(totalBill.toFixed(2))
    };

    getTotalBill();

  }, []);

  return (
    <div className="each-owed">
      <h2> Share Amount</h2>
      <div className="friendsOwe">
        <ul>
          {friends.map((friend, index) => (
            <li style={{display:"flex", flexDirection:"row", justifyContent:"space-between", border: "1px", borderColor:"white"}} key={index}>
              <p> {friend.name}  </p>
              <p> £{Math.round(friend.total * 100) / 100}</p>
            </li>
          ))}
        </ul>
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
          <p style={{fontWeight: "bold"}}>Total Bill </p>
          <p>£{totalBill.toString()}</p>
        </div>

      </div>
      <NextButton buttonName={"Restart"} to={"/"} clickEvent={handleRestart} />
    </div>
  );
}

export default EachOwed;
