import { useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import { useBillContext } from "../Hooks/useBillContext";
import formatMoney from "../utils/FormatMoney";

function createData(name, originalPrice, sharedPrice) {
    return { name, originalPrice: formatMoney(originalPrice), sharedPrice: formatMoney(sharedPrice) };
}

export default function TableItems({ friend }) {
    const { listOfItems, currency } = useBillContext();
    const [showTable, setShowTable] = useState(false);
    const [tableRows, setTableRows] = useState([]);

    const handleToggleTable = () => {
        if (!showTable) {
            const selectedItems = friend.selectedItems.map((selectedItemId) => {
                for (const item of listOfItems) {
                    if (selectedItemId === item.itemId) {
                        return item;
                    }
                }
            });

            const newTableRows = selectedItems.map((item) => {
                return createData(item.name, item.totalPrice, item.sharedUnitPrice);
            });

            setTableRows(newTableRows);
        }

        setShowTable((prev) => !prev);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", justifyItems: "center" }}>
            <Button onClick={handleToggleTable}>{showTable ? <ArrowDropUpIcon sx={{color: "black"}}/> : <ArrowDropDownIcon sx={{color: "black"}}/>}</Button>
            <Collapse in={showTable}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 320, 
                        "& .MuiTableCell-root": {
                            "@media (max-width: 450px)": {
                                fontSize: "12px",
                            },
                            "@media (max-width: 365px)": {
                                fontSize: "10px", // Font size for screens below 365px
                            },
                            padding: "8px"
                        },
                    }} aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Original Price</TableCell>
                                <TableCell align="right">Shared Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tableRows.map((row) => (
                                <TableRow key={row.name} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        {currency} {row.originalPrice}
                                    </TableCell>
                                    <TableCell align="right">
                                        {currency} {row.sharedPrice}
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell rowSpan={3} />
                                <TableCell colSpan={1}>Subtotal</TableCell>
                                <TableCell align="right">
                                    {currency} {formatMoney(friend.subTotal)}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Tax/Discount</TableCell>
                                <TableCell align="right">({`${(friend.chargesPercentage * 100).toFixed(0)} %`}) <br/> {currency} {formatMoney(friend.chargesValue)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total</TableCell>
                                <TableCell align="right">{currency} {formatMoney(friend.totalBill)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Collapse>
        </div>
    );
}
