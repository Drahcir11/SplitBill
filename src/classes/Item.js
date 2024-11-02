import { v4 as uuidv4 } from 'uuid'

class Item {
    constructor(name, unitPrice, quantity){
        this.itemId = uuidv4();
        this.name = name;
        this.unitPrice = parseFloat(unitPrice);
        this.quantity = parseInt(quantity);
    }
}

export default Item;