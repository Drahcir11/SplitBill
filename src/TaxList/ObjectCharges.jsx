import "./ObjectCharges.css";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IconButton, Stack } from "@mui/material";
import { useState } from "react";
import AutosizeInput from "react-18-input-autosize";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { useBillContext } from "../Hooks/useBillContext";

function ObjectCharges({ Charges }) {
    const { dispatch, currency } = useBillContext();
    const [chargesCategory, setChargesCategory] = useState(Charges["name"]);

    return (
        <div className="object-charges__container">
            <div className="object-charges__description ">
                <FormControl
                    sx={{
                        m: 1,
                        minWidth: 180,
                        boxShadow: "none",
                        ".MuiOutlinedInput-notchedOutline": {
                            border: 0,
                        },
                    }}
                    size="small"
                >
                    <Select
                        labelId="object-charges-value-type-label"
                        id="object-charges-value-type"
                        value={chargesCategory}
                        label="Tax"
                        inputProps={{ sx: { pr: "12px !important" }, IconComponent: () => null }} // This gets rid of dropdown arrow
                        sx={{ fontWeight: "700" }}
                        onChange={(e) => {
                            setChargesCategory(e.target.value);
                            dispatch({ type: "UPDATE_CHARGES_NAME", payload: { chargesId: Charges["chargesId"], newChargesName: e.target.value } });
                        }}
                    >
                        <MenuItem value={"Tax"}>Tax</MenuItem>
                        <MenuItem value={"Discount"}>Discount</MenuItem>
                    </Select>
                </FormControl>
                <Stack
                    className="object-charges__input-value-type"
                    direction="row"
                    alignItems="end"
                    justifyContent="center"
                    textAlign="center"
                    marginRight="16px"
                >
                    {Charges["type"] === "Percentage" && <span style={{ fontSize: "12px", fontWeight: "700" }}>%</span>}
                    {Charges["type"] === "Numeric" && <span style={{ fontSize: "12px", fontWeight: "700" }}>{currency}</span>}
                    <AutosizeInput
                        value={Charges["value"]}
                        onChange={(e) => {
                            e.preventDefault();
                            dispatch({ type: "UPDATE_CHARGES_VALUE", payload: { chargesId: Charges["chargesId"], newChargesValue: e.target.value } });
                        }}
                        inputStyle={{
                            minWidth: "25px",
                            display: "flex",
                            fontWeight: "700",
                            fontSize: "12px",
                            marginRight: "0px",
                            padding: "0px",
                            border: "0px",
                            textAlign: "center",
                            backgroundColor: "transparent",
                            borderColor: "transparent",
                        }}
                    />
                </Stack>
            </div>
            <Stack className="charges-controls" direction="row" alignItems="center" justifyContent="center" sx={{ marginBottom: "16px" }}>
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
            </Stack>
        </div>
    );
}

export default ObjectCharges;
