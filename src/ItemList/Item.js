import "./Item.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function Items({ Item, index, items, setItems}) {

  const editItem = (InputId) => {
    setItems(items.map((item, index) => (index === InputId ? { ...item, isEdit: !item.isEdit } : item)));
  };

  const deleteItem = (InputItem) => {
    setItems(items.filter((item) => item.name !== InputItem.name));
  };

  return (
    <div className="item">
      <p>
        {Item.name} - £ {Item.originalPrice} - {Item.quantity} pcs
      </p>
      <div className="item-icon">
        <FontAwesomeIcon icon={faPenToSquare} onClick={() => editItem(index)} />
        <FontAwesomeIcon icon={faTrash} onClick={() => deleteItem(Item)} />
      </div>
    </div>
  );
}

export default Items;
