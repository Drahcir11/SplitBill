import { BillContextReducer } from "../context/BillContext";

describe("BillContextReducer - SPLIT_BILL", () => {
    it("Correctly split the bill among friends", () => {
        // Mock Initial State
        const initialState = {
            listOfFriends: [
                { personId: "friend1", name: "Alice", selectedItems: ["item1"] },
                { personId: "friend2", name: "Bob", selectedItems: ["item1", "item2"] },
                { personId: "friend3", name: "Chris", selectedItems: ["item1", "item2", "item3"] },
            ],
            listOfItems: [
                { itemId: "item1", unitPrice: "10.00", quantity: 2, selectedBy: ["friend1", "friend2", "friend3"] },
                { itemId: "item2", unitPrice: "5.00", quantity: 1, selectedBy: ["friend2", "friend3"] },
                { itemId: "item3", unitPrice: "5.00", quantity: 1, selectedBy: ["friend3"] },
            ],
            listOfCharges: [ {chargesId:"charge1", name:"Tax", type:"Numeric", value:"10"},],
            itemSubTotalCost: "30.00",
            itemTotalCost: "40.00",
            currency: "£",
        };

        const newState = BillContextReducer(initialState, { type: "SPLIT_BILL" });

        // Test each friend's bill
        const friend1 = newState.listOfFriends.find(f => f.personId === "friend1");
        const friend2 = newState.listOfFriends.find(f => f.personId === "friend2");
        const friend3 = newState.listOfFriends.find(f => f.personId === "friend3");

        expect(friend1.subTotal).toBe("6.67");
        expect(friend1.totalBill).toBe("8.89");
        expect(friend1.chargesValue).toBe("2.22");
        expect(friend1.chargesPercentage).toBe("0.333333333333");

        expect(friend2.subTotal).toBe("9.17");
        expect(friend2.totalBill).toBe("12.23");
        expect(friend2.chargesValue).toBe("3.06");
        expect(friend2.chargesPercentage).toBe("0.333333333333");
        
        expect(friend3.subTotal).toBe("14.17");
        expect(friend3.totalBill).toBe("18.89");
        expect(friend3.chargesValue).toBe("4.72");
        expect(friend3.chargesPercentage).toBe("0.333333333333");

        // Test each item's shared unit price
        const item1 = newState.listOfItems.find(item => item.itemId === "item1");
        const item2 = newState.listOfItems.find(item => item.itemId === "item2");
        const item3 = newState.listOfItems.find(item => item.itemId === "item3");

        expect(item1.sharedUnitPrice).toBe("6.67");
        expect(item2.sharedUnitPrice).toBe("2.50");
        expect(item3.sharedUnitPrice).toBe("5.00");
    });

    it("Correctly split the bill with items without friends or friends without items", () => {
        const initialState = {
            listOfFriends: [
                { personId: "friend1", name: "Alice", selectedItems: []},
                { personId: "friend2", name: "Bob", selectedItems: ["item1", "item2"] },
                { personId: "friend3", name: "Chris", selectedItems: ["item1", "item2", "item3"] },
            ],
            listOfItems: [
                { itemId: "item1", unitPrice: "10.00", quantity: 2, selectedBy: ["friend2", "friend3"] },
                { itemId: "item2", unitPrice: "5.00", quantity: 1, selectedBy: ["friend2", "friend3"] },
                { itemId: "item3", unitPrice: "5.00", quantity: 1, selectedBy: ["friend3"] },
                { itemId: "item4", unitPrice: "20.00", quantity: 1, selectedBy: [] },
            ],
            listOfCharges: [],
            itemSubTotalCost: "30.00",
            itemTotalCost: "30.00",
            currency: "£"
        }

        const newState = BillContextReducer(initialState, { type: "SPLIT_BILL" });
        const friend1 = newState.listOfFriends.find(f => f.personId === "friend1");
        const friend2 = newState.listOfFriends.find(f => f.personId === "friend2");
        const friend3 = newState.listOfFriends.find(f => f.personId === "friend3");

        expect(friend1.subTotal).toBe("0.00");
        expect(friend1.totalBill).toBe("0.00");
        expect(friend1.chargesValue).toBe("0.00");
        expect(friend1.chargesPercentage).toBe("0.000000000000");

        expect(friend2.subTotal).toBe("12.50");
        expect(friend2.totalBill).toBe("12.50");
        expect(friend2.chargesValue).toBe("0.00");
        expect(friend2.chargesPercentage).toBe("0.000000000000");

        expect(friend3.subTotal).toBe("17.50");
        expect(friend3.totalBill).toBe("17.50");
        expect(friend3.chargesValue).toBe("0.00");
        expect(friend3.chargesPercentage).toBe("0.000000000000");

        const item1 = newState.listOfItems.find( i => i.itemId === "item1");
        const item2 = newState.listOfItems.find( i => i.itemId === "item2");
        const item3 = newState.listOfItems.find( i => i.itemId === "item3");
        const item4 = newState.listOfItems.find( i => i.itemId === "item4");

        expect(item1.sharedUnitPrice).toBe("10.00");
        expect(item2.sharedUnitPrice).toBe("2.50");
        expect(item3.sharedUnitPrice).toBe("5.00");
        expect(item4.sharedUnitPrice).toBe("0.00");
    });

    it("should not modify state if itemSubTotalCost or itemTotalCost is 0 or less", () => {
        const initialState = {
            listOfFriends: [],
            listOfItems: [],
            listOfCharges: [],
            itemSubTotalCost: 0.00,
            itemTotalCost: 0.00,
            currency: "£",
        };

        const newState = BillContextReducer(initialState, { type: "SPLIT_BILL" });

        expect(newState).toEqual(initialState); // Should return the same state
    });
});
