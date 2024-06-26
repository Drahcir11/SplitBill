import './TaxItem.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'


function TaxItem({Item, index, deleteItem, editItem}) {



    return (  
        <div className="tax-item" 
        style={{
            backgroundColor: "white"
        }}>
            <p>{Item.name} ({Item.originalPrice}%)</p>
            <div className='item-icon'>
                <FontAwesomeIcon icon={faPenToSquare} onClick={() => editItem(index)}/>
                <FontAwesomeIcon icon={faTrash} onClick={() => deleteItem(Item)}/>
            </div>
        </div>
    );
}

export default TaxItem;