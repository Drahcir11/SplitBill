import { v4 as uuidv4 } from 'uuid';

class Person {
	constructor(name) {
		this.personId = uuidv4();
		this.name = name;
		this.totalBill = 0.00;
		this.selectedItems = [];
	}
}

export default Person;