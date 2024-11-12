import NextButton from "./Button/NextPageButton";
import "./EachOwed.css";
import Divider from '@mui/material/Divider';
import { useBillContext } from "./Hooks/useBillContext";

function EachOwed() {

  const {listOfFriends, itemTotalCost } = useBillContext();

  // On clicking restart, clear out local storage of item and friends data
  const handleRestart = () => {
  };

  return (
    <div className="each-owed">
      <h2> Share Amount</h2>
      <div className="friendsOwe">
        <ul>
          {listOfFriends.map((friend, index) => (
            <div>
              <li style={{display:"flex", flexDirection:"row", justifyContent:"space-between", border: "1px", borderColor:"white"}} key={index}>
                <p> {friend.name}  </p>
                <p> £ {friend.totalBill.toFixed(2)}</p>
              </li>
              <Divider/>
            </div>
          ))}
        </ul>
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
          <p style={{fontWeight: "bold"}}>Total Bill </p>
          <p>£{itemTotalCost}</p>
        </div>

      </div>
      <NextButton buttonName={"Restart"} to={"/"} clickEvent={handleRestart} />
    </div>
  );
}

export default EachOwed;
