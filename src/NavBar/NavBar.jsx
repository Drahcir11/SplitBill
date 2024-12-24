import "./NavBar.css";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Link } from "react-router-dom";
import { useBillContext } from "../Hooks/useBillContext";
import { Typography, Box, Button } from "@mui/material";

function NavBar() {
    const { dispatch, currency } = useBillContext();
    return (
        <>
            <div className="nav">
                <a href="/" className="logo">
                    <img style={{ height: "2em", marginLeft: "1em" }} src="./receipt.svg" alt="bear logo" />
                </a>
                <div className="non-logo">
                    <FormControl
                        className="currency-dropdown"
                        // inline css here since having difficulties putting it in actual css file
                        sx={{
                            minWidth: "50px",
                            margin: "8px",
                            boxShadow: "none",
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
                                ".MuiOutlinedInput-notchedOutline": {
                                    border: 0,
                                },
                                "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    border: 0,
                                },
                                "& #charges-category": {
                                    fontSize: "1em",
                                    fontWeight: "700",
                                },
                            }}
                            onChange={(e) => {
                                dispatch({ type: "UPDATE_CURRENCY", payload: { newCurrency: e.target.value } });
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        border: "2px solid black", // Add a solid border
                                    },
                                },
                            }}
                        >
                            <MenuItem value="£">£</MenuItem>
                            <MenuItem value={"$"}>$</MenuItem>
                            <MenuItem value={"Rp"}>Rp</MenuItem>
                        </Select>
                    </FormControl>
                    <Box>
                        <Link to="/howto">
                            <Button
                                variant="contained"
                                sx={{
                                    color: "black", fontSize: "0.8em", marginRight: "16px", border: "2px solid black",
                                    borderRadius: "4px", padding: "5px 10px", backgroundColor: "white", boxShadow: "2px 2px black",
                                    fontWeight: "1000", cursor: "pointer", textTransform: "none", transition: "box-shadow 0.5s",
                                    "&:hover": {
                                        boxShadow: "0px 0px",
                                        backgroundColor: "white",
                                    },
                                }}
                            >
                                How To Use?
                            </Button>
                        </Link>
                    </Box>
                </div>
            </div>
        </>
    );
}

export default NavBar;
