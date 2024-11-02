import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IconButton, Stack } from "@mui/material";
import { useState } from "react"
import AutosizeInput from "react-18-input-autosize";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { useBillContext } from "../Hooks/useBillContext";

function ObjectCharges({ Charges }) {
    const { dispatch } = useBillContext();
    const [chargesCategory, setChargesCategory] = useState(Charges["name"]);

    return (
        <div className="item">
            <div className="item-description">
                <FormControl
                    sx={{
                        m: 1,
                        minWidth: 180,
                        boxShadow: "none",
                        ".MuiOutlinedInput-notchedOutline": {
                            border: 0
                        },
                    }}
                    size="small"
                >
                    {/* <InputLabel id="demo-simple-select-label">Tax/Discounts</InputLabel> */}
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={chargesCategory}
                        label="Service Charges"
                        onChange={(e) => {
                            setChargesCategory(e.target.value);
                            dispatch({ type: "UPDATE_CHARGES_NAME", payload: { chargesId: Charges["chargesId"], newChargesName: e.target.value } });
                        }}
                    >
                        <MenuItem value={"Service Charges"}>Service Charges</MenuItem>
                        <MenuItem value={"Discount"}>Discount</MenuItem>
                    </Select>
                </FormControl>
                <Stack className="input-item-unit-price" direction="row" alignItems="end" justifyContent="center" textAlign="center">
                    <AutosizeInput
                        value={Charges["value"]}
                        onChange={(e) => {
                            e.preventDefault();
                            dispatch({ type: "UPDATE_CHARGES_VALUE", payload: { chargesId: Charges["chargesId"], newChargesValue: e.target.value } });
                        }}
                        inputStyle={{
                            display: "flex",
                            fontWeight: "700",
                            fontSize: "12px",
                            marginRight: "0px",
                            padding: "0px",
                            border: "0px",
                            textAlign: "left",
                            backgroundColor: "transparent",
                            borderColor: "transparent",
                        }}
                    />
                    <span style={{ fontSize: "12px", fontWeight: "500" }}>%</span>
                </Stack>
            </div>
            <div className="item-editable">
                <Stack className="charges-controls" direction="row" alignItems="center" justifyContent="center">
                    {/* Render minus or trash icon based on the item quantity */}
                    <div className="icon">
                        <IconButton
                            onClick={() => {
                                dispatch({ type: "REMOVE_CHARGES", payload: { chargesId: Charges["chargesId"] } });
                            }}
                            sx={{
                                padding: "0px",
                                color: "red",
                            }}
                        >
                            <DeleteOutlineIcon sx={{ fontSize: "15px" }} />
                        </IconButton>
                    </div>
                    {/* <div className="quantity-display">{Item.quantity}</div> */}
                </Stack>
            </div>
        </div>
    );
}

export default ObjectCharges;
