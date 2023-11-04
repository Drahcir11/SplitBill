import "./Item.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

function Items({ Item, index, items, setItems}) {

  const editItem = (InputId) => {
    setItems(items.map((item, index) => (index === InputId ? { ...item, isEdit: !item.isEdit } : item)));
  };

  const deleteItem = (InputItem) => {
    setItems(items.filter((item) => item.name !== InputItem.name));
  };

  const increaseQuantity = (InputId) => {
    setItems(items.map((item, index)=>(
      index === InputId ? {...item, quantity: item.quantity + 1 } : item
    )))
  };

  const decreaseQuantity = (InputId) => {
    setItems(items.map((item, index)=>(
      index === InputId ? {...item, quantity: item.quantity - 1 } : item
    )))
  };

  return (
    <div className="item">
      <div className="item-description">
        <p className="item-name">{Item.name}</p>
        <p className="item-price">£{Item.originalPrice}</p>
      </div>
      <div className="item-editable">
        <div className="item-controls">
          {/* Render minus or trash icon based on the item quantity */}
          <div className="icon">
            {Item.quantity < 2 ? (
              <FontAwesomeIcon icon={faTrash} className="icon-trash" size="xs" onClick={() => deleteItem(Item)} />
            ) : (
              <FontAwesomeIcon icon={faMinus} size="xs" onClick={() => decreaseQuantity(index)} />
            )}
          </div>
          <div className="quantity-display">{Item.quantity}</div>
          <div className="icon">
            <FontAwesomeIcon icon={faPlus} size="xs" onClick={() => increaseQuantity(index)} />
          </div>
        </div>
        <div className="icon">
          <FontAwesomeIcon icon={faPenToSquare} size="xs" onClick={() => editItem(index)} />
        </div>
      </div>
    </div>
  );
}

export default Items;
