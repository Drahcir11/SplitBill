import "./ObjectItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IconButton, Stack } from "@mui/material";
import AutosizeInput from 'react-18-input-autosize';
import { useBillContext } from "../Hooks/useBillContext";

function ObjectItem({ Item }) {
    const { dispatch } = useBillContext();

    return (
        <div className="item">
            <div className="item-description">
                {/* <p className="item-name">OBJECT - {Item.name}</p> */}
                <input
                    value={Item.name}
                    onChange={(e) => {
                        e.preventDefault();
                        dispatch({ type: "UPDATE_ITEM_NAME", payload: { itemId: Item.itemId, newItemName: e.target.value } });
                    }}
                    type="text"
                    style={{
                        fontWeight: "700",
                        fontSize: "14px",
                        outline: "none",
                        backgroundColor: "transparent",
                        borderColor: "transparent",
                    }}
                />
                <Stack className="input-item-unit-price" direction="row" alignItems="baseline">
                    <span style={{ display:"flex", fontSize: "14px", marginRight:"2.5px", fontWeight: "700" }}>£</span>
                    <AutosizeInput
                        value={Item.unitPrice}
                        onChange={(e) => {
                            e.preventDefault();
                            dispatch({ type: "UPDATE_ITEM_UNIT_PRICE", payload: { itemId: Item.itemId, newItemUnitPrice: e.target.value } });
                        }}
                        type="text"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        inputStyle={{
                            minWidth: "45px",
                            display:"flex",
                            fontWeight: "700",
                            fontSize: "14px",
                            marginRight: "0px",
                            padding: "0px 0px 0px 0px",
                            border: "none",
                            textAlign: "left",
                            backgroundColor: "transparent",
                            borderColor: "transparent",
                        }}
                    />
                </Stack>
            </div>
            <div className="item-editable">
                <Stack className="item-controls" direction="row" alignItems="center" justifyContent="center">
                    {/* Render minus or trash icon based on the item quantity */}
                    <div className="icon">
                        {Item.quantity < 2 ? (
                            <IconButton
                                onClick={() => {
                                    dispatch({ type: "REMOVE_ITEM", payload: { itemId: Item.itemId } });
                                }}
                                sx={{
                                    padding: "0px",
                                    color: "red",
                                }}
                            >
                                <DeleteOutlineIcon sx={{ fontSize: "19px" }} />
                            </IconButton>
                        ) : (
                            <FontAwesomeIcon
                                icon={faMinus}
                                size="lg"
                                onClick={() => {
                                    dispatch({ type: "UPDATE_ITEM_QUANTITY", payload: { itemId: Item.itemId, qtyChange: -1 } });
                                }}
                            />
                        )}
                    </div>
                    <div className="quantity-display">{Item.quantity}</div>
                    <div className="icon">
                        <FontAwesomeIcon
                            icon={faPlus}
                            size="lg"
                            onClick={() => {
                                dispatch({ type: "UPDATE_ITEM_QUANTITY", payload: { itemId: Item.itemId, qtyChange: 1 } });
                            }}
                        />
                    </div>
                </Stack>
            </div>
        </div>
    );
}

export default ObjectItem;
