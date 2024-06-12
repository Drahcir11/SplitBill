import React, { useEffect, useState } from "react";
import NextButton from "../Button/NextPageButton";
import AddButton from "../Button/AddButton";
import "./Tax.css";
import EditItem from "./EditTaxItem";
import TaxItem from "./TaxItem";
import { isNumber, isValidInput, noWhiteSpace } from "../ErrorHandling";

// Function component called "BillSplitter" that takes "items" and "setItems" as props
function TaxList({ tax, setTax }) {
  const [services, setServices] = useState("");
  const [priceCharge, setPriceCharge] = useState("");

  const handleSubmitTax = (e) => {
    e.preventDefault();
    if(!noWhiteSpace(services) || !noWhiteSpace(priceCharge)){
      return;
    }
    setTax([...tax, { name: services, originalPrice: priceCharge, priceWithTax: 0, isEdit: false }]);
    setServices("");
    setPriceCharge("");
  };

  const deleteItem = (ItemInp) => {
    setTax(tax.filter((ItemVal) => ItemVal.name !== ItemInp.name));
  };

  const editItem = (id) => {
    setTax(tax.map((taxval, taxindex) => (taxindex === id ? { ...taxval, isEdit: !taxval.isEdit } : taxval)));
    // console.log("Tax edit :",tax)
  };

  const editItemList = (name, originalPrice, id) => {
    setTax(tax.map((taxval, index) => (index === id ? { ...taxval, name, originalPrice, isEdit: !taxval.isEdit } : taxval)));
    // console.log("Tax edit list :",tax)
  };

  // Render the UI components for the Bill Splitter app.
  return (
    <div className="tax-container">
      <div className="tax-list">
        <h1 style={{fontSize: "24px", marginBlockEnd: "0px", marginBlockStart: "48px"}} > Tax/Services</h1>
        <h5 style={{fontWeight: "500", fontSize: "12px", marginBlockStart:"0px", marginBlockEnd: "24px"}}> 
          Enter Tax/Services charges percentage value (%).</h5>
        <form onSubmit={handleSubmitTax} className="tax-form">
          {/* Input field for entering the item's name */}
          <input
            className="input-tax"
            type="text"
            placeholder="e.g. Service Charge"
            value={services}
            onChange={(e) => 
              {
                if(isValidInput(e.target.value)){
                  setServices(e.target.value)
                }
              }} // Update the "name" state variable when the input changes
          />
          {/* Input field for entering the item's originalPrice */}
          <input
            className="tax-input-price"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 20 (%)"
            min="0"
            step="0.01"
            value={priceCharge}
            onChange={(e) => 
              {
                if(isNumber(e.target.value)){
                  setPriceCharge(e.target.value)
                }
              }} // Update the "price" state variable when the input changes
          />
          {/* Button to add the item to the list */}
          {/* <button type="submit">Add Item</button> */}
          <AddButton buttonName={"Add"} type={"submit"} />
        </form>
        {/* List to display the added items */}
        <div className="tax-name-list">
          <ul>
            {tax.map((taxval, taxindex) => {
              if (taxval.isEdit) {
                return <EditItem Item={taxval} index={taxindex} editItemList={editItemList} />;
              } else {
                return <TaxItem Item={taxval} index={taxindex} deleteItem={deleteItem} editItem={editItem} />;
              }
            })}
          </ul>
        </div>
        <NextButton buttonName={"Next"} to={"/itemSelection"} />
      </div>
    </div>
  );
}

// Export the BillSplitter component as the default export of this module.
export default TaxList;
