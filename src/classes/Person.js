import { v4 as uuidv4 } from 'uuid';

class Person {
	constructor(name) {
		this.person_id = uuidv4();
		this.name = name;
		this.totalBill = 0.00;
		this.selectedItems = [];
		this.isEdit = false;
	}

	// Add item to the person's list of selected items
	addItem(item) {
		// Avoid adding duplicates
		if (!this.selectedItems.includes(item)) {
			this.selectedItems.push(item);
			this.updateTotalBill();
			item.numSelected++;
		}
	}

	// Remove item from the person's list of selected items
	removeItem(item) {
		const index = this.selectedItems.indexOf(item);
		if (index > -1) {
			this.selectedItems.splice(index, 1);
			this.updateTotalBill();
			item.numSelected--;
		}
	}

	// Update total bill based on selected items
	updateTotalBill() {
		this.totalBill = this.selectedItems.reduce((sum, item) => sum + item.totalPrice, 0.00);
	}

	// Getters/Setters
	getTotalBill() {
		return this.totalBill;
	}

	getSelectedItems() {
		return this.selectedItems;
	}
}

export default Person;