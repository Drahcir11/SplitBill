import "./Item.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IconButton, Stack } from "@mui/material";

function Items({ Item, index, items, setItems }) {
    const editItem = (InputId) => {
        setItems(items.map((item, index) => (index === InputId ? { ...item, isEdit: !item.isEdit } : item)));
    };

    const deleteItem = (InputItem) => {
        setItems(items.filter((item) => item.name !== InputItem.name));
    };

    const increaseQuantity = (InputId) => {
        // Create a new array with the same items
        const newItems = [...items];

        // Update the quantity of the item at InputId index
        if (newItems[InputId]) {
            const currentQuantity = parseFloat(newItems[InputId].quantity); // Ensure the quantity is a float
            newItems[InputId] = {
                ...newItems[InputId],
                quantity: currentQuantity + 1,
            };
        }

        // Set the new array as the new state
        setItems(newItems);
    };

    const decreaseQuantity = (InputId) => {
        setItems(items.map((item, index) => (index === InputId ? { ...item, quantity: item.quantity - 1 } : item)));
    };

    return (
        <div className="item">
            <div className="item-description">
                <p className="item-name">{Item.name}</p>
                <p className="item-price">
                    £{Item.originalPrice} <span style={{ fontSize: "8px", fontWeight: "500" }}>per unit</span>
                </p>
            </div>
            <div className="item-editable">
                <Stack className="item-controls" direction="row" alignItems="center" justifyContent="center">
                    {/* Render minus or trash icon based on the item quantity */}
                    <div className="icon">
                        {Item.quantity < 2 ? (
                            // <FontAwesomeIcon icon={faTrash} className="icon-trash" size="24px" onClick={() => deleteItem(Item)} />
                            <IconButton
                                onClick={() => {
                                    deleteItem(Item);
                                }}
                                sx={{
                                    padding: "0px",
                                    color: "red",
                                }}
                            >
                                <DeleteOutlineIcon sx={{ fontSize: "15px" }} />
                            </IconButton>
                        ) : (
                            <FontAwesomeIcon icon={faMinus} size="xs" onClick={() => decreaseQuantity(index)} />
                        )}
                    </div>
                    <div className="quantity-display">{Item.quantity}</div>
                    <div className="icon">
                        <FontAwesomeIcon icon={faPlus} size="xs" onClick={() => increaseQuantity(index)} />
                    </div>
                </Stack>
                <div className="edit-icon">
                    <FontAwesomeIcon icon={faPenToSquare} size="xs" onClick={() => editItem(index)} />
                </div>
            </div>
        </div>
    );
}

export default Items;
