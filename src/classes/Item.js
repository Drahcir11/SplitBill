import { v4 as uuidv4 } from 'uuid'

class Item {
    constructor(name, unitPrice, quantity, totalPrice){
        this.itemId = uuidv4();
        this.name = name;
        this.unitPrice = parseFloat(unitPrice);
        this.quantity = parseInt(quantity);
        this.totalPrice = totalPrice;
        this.selectedBy = [];
    }
}

export default Item;