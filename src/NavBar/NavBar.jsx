import "./NavBar.css";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { useBillContext } from "../Hooks/useBillContext";
import { Typography } from "@mui/material";

function NavBar() {
    const { dispatch, currency } = useBillContext();
    return (
        <>
            <div className="nav">
                <ul>
                    <a href="/" className="logo">
                        <img src="./sssam_split_no_bg.png" alt="bear logo" />
                    </a>
                    {/* <h1 className="logo">Logo</h1> */}
                    <div className="non-logo">
                        <li>
                            <FormControl
                                className="currency-dropdown"
                                // inline css here since having difficulties putting it in actual css file
                                sx={{
                                    minWidth: "50px",
                                    margin: "8px",
                                    boxShadow: "none",
                                    ".MuiOutlinedInput-notchedOutline": {
                                        border: 0,
                                    },
                                }}
                                size="small"
                            >
                                <Select
                                    renderValue={(value) => {
                                        if (!value) {
                                            return <Typography sx={{ fontWeight: "700", fontSize: "1em" }}>£</Typography>;
                                        }
                                        return value;
                                    }}
                                    labelId="charges-category-label"
                                    id="charges-category"
                                    value={currency}
                                    displayEmpty
                                    sx={{
                                        "& #charges-category": {
                                            fontSize: "1em",
                                            fontWeight: "700",
                                        },
                                    }}
                                    onChange={(e) => {
                                        dispatch({ type: "UPDATE_CURRENCY", payload: { newCurrency: e.target.value } });
                                    }}
                                >
                                    <MenuItem value="£">£</MenuItem>
                                    <MenuItem value={"$"}>$</MenuItem>
                                    <MenuItem value={"Rp"}>Rp</MenuItem>
                                </Select>
                            </FormControl>
                        </li>
                    </div>
                </ul>
            </div>
        </>
    );
}

export default NavBar;
