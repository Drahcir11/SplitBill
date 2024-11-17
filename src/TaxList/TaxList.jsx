import "./TaxList.css";

import { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import NextButton from "../Button/NextPageButton";
import AddButton from "../Button/AddButton";
import ObjectCharges from "./ObjectCharges";
import { useBillContext } from "../Hooks/useBillContext";
import { noWhiteSpace } from "../ErrorHandling";

function TaxList() {
    const { dispatch, listOfCharges, itemSubTotalCost, itemTotalCost } = useBillContext();

    const [chargesValue, setChargesValue] = useState("");
    const [chargesCategory, setChargesCategory] = useState("Tax");
    const [chargesValueType, setChargesValueType] = useState("");

    const handleChargesSubmit = (e) => {
        e.preventDefault();

        // Do nothing when charges value not set
        if (!chargesValue) {
            return;
        }

        // Do nothing when charges value is set to empty string
        if (!noWhiteSpace(chargesValue)) {
            return;
        }

        dispatch({ type: "ADD_CHARGES", payload: { chargesCategory, chargesValueType, chargesValue } });
    };

    return (
        <div className="receipt-capture__tax-container">
            <h1>TAX & DISCOUNTS</h1>
            <h5>Add the list of tax charges or discounts.</h5>
            <div className="receipt-capture__form-container">
                <form onSubmit={handleChargesSubmit}>
                    <FormControl className="receipt-capture__form-control-charges-category" 

                        // inline css here since having difficulties putting it in actual css file
                        sx={{minWidth: "100px", margin:"8px", backgroundColor: "white"}} 
                        size="small"
                    >
                        <InputLabel id="charges-category-label">Tax/Discounts</InputLabel>
                        <Select
                            labelId="charges-category-label"
                            id="charges-category"
                            value={chargesCategory}
                            label="Service Charges"
                            sx={{
                                "& #charges-category": {
                                    fontSize: "0.8em",
                                },
                            }}
                            onChange={(e) => {
                                setChargesCategory(e.target.value);
                            }}
                        >
                            <MenuItem value={"Tax"}>Tax</MenuItem>
                            <MenuItem value={"Discount"}>Discount</MenuItem>
                        </Select>
                    </FormControl>
                    <input
                        className="receipt-capture_input-charges-value"
                        type="text"
                        inputMode="decimal"
                        placeholder="12.5"
                        min={0}
                        max={100}
                        step={0.01}
                        value={chargesValue}
                        onChange={(e) => {
                            setChargesValue(e.target.value);
                        }}
                    />
                    <FormControl className="receipt-capture__form-control-charges-value-type" 
                        sx={{ margin: "8px", minWidth: "70px", backgroundColor: "white"}}
                        size="small"
                    >
                        {!chargesValueType && <InputLabel id="charges-value-type-select-label">%</InputLabel>}
                        {chargesValueType && <InputLabel id="charges-value-type-select-label">{chargesValueType}</InputLabel>}
                        <Select
                            labelId="charges-value-type-select-label"
                            id="charges-value-type-select"
                            value={chargesValueType}
                            label="Charges Value Type"
                            inputProps={{ sx: { pr: "12px !important" }, IconComponent: () => null }} // Remove drop down arrow icon
                            sx={{
                                "& #charges-value-type-select": {
                                    fontSize: "0.8em",
                                },
                            }}
                            onChange={(e) => {
                                setChargesValueType(e.target.value);
                            }}
                        >
                            <MenuItem value={"Percentage"}>%</MenuItem>
                            <MenuItem value={"Numeric"}>.123</MenuItem>
                        </Select>
                    </FormControl>
                    <AddButton buttonName={"+"} type={"submit"} />
                </form>
            </div>
            <div className="receipt-capture__item-cost-container">
                <div className="receipt-capture__item-charges-sub-total">
                    <p>Sub total: </p>
                    <p>
                        £{itemSubTotalCost}
                        <span style={{ fontSize: "8px", fontWeight: "500" }}> (excl tax)</span>
                    </p>
                </div>
                <div className="receipt-capture__item-charges-total-cost">
                    <p>Total cost: </p>
                    <p>£{itemTotalCost}</p>
                </div>
            </div>

            {/* List to display the added items */}
            <div className="receipt-capture__item-name-list">
                <ul>
                    {listOfCharges.map((charges, index) => {
                        return <ObjectCharges key={index} Charges={charges} />;
                    })}
                </ul>
            </div>
            <NextButton buttonName={"< NEXT PAGE >"} to={"/ObjectItemSelection"} />
        </div>
    );
}

export default TaxList;
