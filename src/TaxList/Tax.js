import React, { useEffect, useState } from 'react';
import NextButton from '../Button/NextPageButton';
import AddButton from '../Button/AddButton';
import './Tax.css'
import EditItem from './EditTaxItem';
import TaxItem from './TaxItem';



// Function component called "BillSplitter" that takes "items" and "setItems" as props
function TaxList({tax, setTax }) {

    const [services, setServices] = useState('');
    const [priceCharge, setPriceCharge] = useState('');

    const handleSubmitTax = (e) => {
        e.preventDefault();

        setTax([...tax,{name: services, originalPrice: priceCharge, priceWithTax: 0, isEdit: false}])
            setServices('');
            setPriceCharge('');
    }

    const deleteItem = (ItemInp) => {
        setTax(tax.filter((ItemVal) => ItemVal.name !== ItemInp.name));
    }

    const editItem = (id) => {
        setTax(
            tax.map((taxval,taxindex) =>
                taxindex === id ? { ...taxval, isEdit: !taxval.isEdit } : taxval
            )
        );
        // console.log("Tax edit :",tax)
    };

    const editItemList = (name, originalPrice, id) => {
    setTax(
        tax.map((taxval, index) =>
        index === id ? { ...taxval, name, originalPrice, isEdit: !taxval.isEdit } : taxval
        ));
    // console.log("Tax edit list :",tax)
    };

    // Render the UI components for the Bill Splitter app.
    return (
    <div className='tax-container'>
        <div className='tax-list'>
        <h1>List of tax & services</h1>
        <form onSubmit={handleSubmitTax} className='tax-form'>
            {/* Input field for entering the item's name */}
            <input
                className='input-tax'
                type="text"
                placeholder="Tax & Services"
                value={services}
                onChange={(e) => setServices(e.target.value)} // Update the "name" state variable when the input changes
            />
            {/* Input field for entering the item's originalPrice */}
            <input
                className='tax-input-price'
                type="number"
                placeholder="%"
                min="0"
                step="0.01"
                value={priceCharge}
                onChange={(e) => setPriceCharge(e.target.value)} // Update the "price" state variable when the input changes
            />
            {/* Button to add the item to the list */}
            {/* <button type="submit">Add Item</button> */}
            <AddButton buttonName={"Add tax"} type={"submit"}/>
        </form>
            {/* List to display the added items */}
            <div className='tax-name-list'>
            <ul>
            {tax.map((taxval, taxindex) => 
                {
                    if(taxval.isEdit){
                        return <EditItem Item={taxval} index={taxindex} editItemList={editItemList} />
                    } else {
                        return <TaxItem Item={taxval} index={taxindex} deleteItem={deleteItem} editItem={editItem}/>
                    }
                }
            )}
            </ul>
            </div>
        <NextButton buttonName={"Next"} to={"/itemSelection"}/>
        </div>
    </div>
    );
}

// Export the BillSplitter component as the default export of this module.
export default TaxList;
