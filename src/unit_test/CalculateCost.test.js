import { calculateSubTotalCost, calculateTotalCost } from "../context/BillContext";

describe("Item cost related calculation", () => {
    it("Calculate total cost with numeric charges", () => {
        const itemSubTotalCost = "10.00";
        const listOfCharges = [
            {chargesId:"charge_1", name:"Tax", type:"Numeric", value:"20"},
            {chargesId:"charge_2", name:"Discount", type:"Numeric", value:"10"}
        ];

        const receivedTotalCost = calculateTotalCost(itemSubTotalCost, listOfCharges);
        expect(receivedTotalCost).toBe("20.00");
    });

    it("calculate total cost with percentage charges", () => {
        const itemSubTotalCost = "100.00";
        const listOfCharges = [
            {chargesId:"charge_1", name:"Tax", type:"Percentage", value:"12.5"},
            {chargesId:"charge_2", name:"Discount", type:"Percentage", value:"4.5"},
        ];
        
        const receivedTotalCost = calculateTotalCost(itemSubTotalCost, listOfCharges);
        expect(receivedTotalCost).toBe("107.44");
    })

});