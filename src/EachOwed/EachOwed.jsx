import NextButton from "../Button/NextPageButton";
import "./EachOwed.css";
import { useBillContext } from "../Hooks/useBillContext";

function EachOwed() {

  const { dispatch, listOfFriends, itemTotalCost, currency } = useBillContext();

  // On clicking restart, clear out local storage of item and friends data
  const handleRestart = () => {

    dispatch({type: "RESTART_ALL"})
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
            <div className="each-owed__friends-list" key={index}>
              <li style={{display:"flex", flexDirection:"row", justifyContent:"space-between", border: "1px", borderColor:"white"}} >
                <p> {friend.name}  </p>
                <p> {currency} {friend.totalBill.toFixed(2)}</p>
              </li>
            </div>
          ))}
        </ul>
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", fontWeight: "700"}}>
          <p style={{fontWeight: "700"}}>Total Bill </p>
          <p>{currency}{itemTotalCost}</p>
        </div>

      </div>
      <NextButton buttonName={"RESTART"} to={"/"} clickEvent={handleRestart} />
    </div>
  );
}

export default EachOwed;
