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
      <h1
      style={{
        fontSize: "36px",
        fontWeight: "1000",
        marginBlockEnd: "0px",
        marginBlockStart: "48px",
        color: "white",
        textShadow: "2px 2px black",
      }}
      > SPLIT BILL</h1>
      <div className="friendsOwe">
        <ul>
          {listOfFriends.map((friend, index) => (
            <div className="each-owed__friends-list">
              <li style={{display:"flex", flexDirection:"row", justifyContent:"space-between", border: "1px", borderColor:"white"}} key={index}>
                <p> {friend.name}  </p>
                <p> £ {friend.totalBill.toFixed(2)}</p>
              </li>
            </div>
          ))}
        </ul>
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", fontWeight: "700"}}>
          <p style={{fontWeight: "700"}}>Total Bill </p>
          <p>£{itemTotalCost}</p>
        </div>

      </div>
      <NextButton buttonName={"Restart"} to={"/"} clickEvent={handleRestart} />
    </div>
  );
}

export default EachOwed;
