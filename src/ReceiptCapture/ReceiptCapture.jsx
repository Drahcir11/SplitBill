import { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import Cropper from "react-cropper";
import Tesseract from "tesseract.js";
import "cropperjs/dist/cropper.css";
import "./ReceiptCapture.css"; // Assuming you have a CSS file for styling
import NextButton from "../Button/NextPageButton";
import ObjectItem from "../ItemList/ObjectItem";
import { useBillContext } from "../Hooks/useBillContext";
import { isNumber, isValidInput, noWhiteSpace } from "../ErrorHandling";
import AddButton from "../Button/AddButton";

// Styling for MUI buttons to upload & capture receipts
const uploadImageButtonStyles = {
    textTransform: "none",
    fontSize: "12px",
    fontWeight: "1000",
    padding: "5px 10px",
    borderColor: "black",
    color: "black",
    borderWidth: "2.5px",
    hover: {
        borderWidth: "2.5px",
        borderColor: "black",
        color: "black",
        boxShadow: "0px 0px",
    },
    boxShadow: "3px 3px",
};

const cropImageButtonStyles = {
    color: "black",
    borderColor: "black",
    backgroundColor: "#E3A018 !important",
    padding: "6px 10px 6px 10px",
    borderWidth: "2.5px !important",
    borderStyle: "solid !important",
    fontSize: "14px",
    fontWeight: "1000",
    width: "100%",
    boxShadow: "4px 4px",
};

function ReceiptCapture() {
    const { dispatch, listOfItems } = useBillContext();

    const [name, setName] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [subTotal, setSubTotal] = useState(0.0);

    // Function to handle form submission when the "Add Item" button is clicked.
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!noWhiteSpace(name) || !noWhiteSpace(originalPrice)) {
            return;
        }
        if (!quantity) {
            dispatch({ type: "ADD_ITEM", payload: { itemName: name, unitPrice: originalPrice, quantity: 1 } });
        } else {
            dispatch({ type: "ADD_ITEM", payload: { itemName: name, unitPrice: originalPrice, quantity: quantity } });
        }

        // Reset the "name" and "originalPrice" state variables to empty strings after adding the item.
        setName("");
        setOriginalPrice("");
        setQuantity("");
    };

    const [image, setImage] = useState(() => {
        const storedReceiptImage = sessionStorage.getItem("my-receipt-image");
        return storedReceiptImage ? storedReceiptImage : null;
    });

    useEffect(() => {
        sessionStorage.setItem("my-receipt-image", image);
    }, [image]);

    const [submitFile, setSubmitFile] = useState(() => {
        const storedSubmitFile = sessionStorage.getItem("my-submit-file");
        return storedSubmitFile ? storedSubmitFile : false;
    });

    useEffect(() => {
        sessionStorage.setItem("my-submit-file", submitFile);
    }, [submitFile]);

    const cropperRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
        setSubmitFile(true);
    };

    const handleCrop = () => {
        const cropper = cropperRef.current.cropper;
        cropper.getCroppedCanvas().toBlob((blob) => {
            const image = URL.createObjectURL(blob);
            dispatch({ type: "RESET_ITEMS" });
            extractText(image);
        });
    };

    const extractText = (image) => {
        Tesseract.recognize(image, "eng", {
            logger: (m) => console.log(m),
        }).then(({ data: { text } }) => {
            let extractedText = text.split("\n");

            const itemNames = [];
            const itemPrices = [];

            extractedText.forEach((item) => {
                const cleanedItem = item.replace(/[^\w\s.]/g, "");

                // Regular expression to match item name and price
                const match = cleanedItem.match(/(.+?)\s*(\d+\.\d{1,2})/);

                console.log("item :", item, "regex match :", match);

                if (match) {
                    const itemName = match[1].trim();
                    const itemPrice = match[2].replace(/[\$£]/g, "").trim();

                    itemNames.push(itemName);
                    itemPrices.push(parseFloat(itemPrice));
                    dispatch({ type: "ADD_ITEM", payload: { itemName: itemName, unitPrice: itemPrice, quantity: 1 } });
                }
            });
        });
    };

    return (
        <div className="receipt-capture__container">
            <div className="receipt-capture__text-content">
                <h1 className="receipt-capture__title">RECEIPT CAPTURE</h1>
                <h5 className="receipt-capture__heading">
                    Capture the receipt with your camera and <strong>only</strong> crop the area<br></br>
                    listing the <strong>item's name and prices</strong>.
                </h5>
                <Button
                    variant="outlined"
                    component="label"
                    sx={{
                        ...uploadImageButtonStyles,
                        backgroundColor: "white",
                        marginRight: "32px",
                        "&:hover": {
                            ...uploadImageButtonStyles["hover"],
                            backgroundColor: "#ad7aff",
                        },
                    }}
                >
                    UPLOAD
                    <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" hidden />
                </Button>
                <Button
                    variant="outlined"
                    component="label"
                    sx={{
                        ...uploadImageButtonStyles,
                        backgroundColor: "#ad7aff",
                        "&:hover": {
                            ...uploadImageButtonStyles["hover"],
                            backgroundColor: "white",
                        },
                    }}
                >
                    CAPTURE
                    <input type="file" accept="image/*" capture onChange={handleFileChange} className="file-input" hidden />
                </Button>
            </div>
            <div className="receipt-capture__image-container">
                {image && (
                    <div className="receipt-capture__image-content">
                        <Cropper src={image} initialAspectRatio={1} guides={false} ref={cropperRef} dragMode={"none"} />
                    </div>
                )}
                {submitFile && (
                    <div className="receipt-capture__crop-image-button-container">
                        <Button
                            variant="contained"
                            onClick={handleCrop}
                            className="crop-button"
                            sx={{
                                ...cropImageButtonStyles,
                            }}
                        >
                            CROP IMAGE
                        </Button>
                    </div>
                )}
            </div>
            <div className="receipt-capture__item-container">
                <h1>ITEMS</h1>
                <h5>Add the list of purchased food items per unit price.</h5>
                <form onSubmit={handleSubmit}>
                    <div className="receipt-capture__input-form-item">
                        {/* Input field for entering the item's name */}
                        <input
                            className="input-item"
                            type="text"
                            placeholder="e.g. Salmon Sashimi"
                            value={name}
                            maxLength="28"
                            onChange={(e) => {
                                if (isValidInput(e.target.value)) {
                                    setName(e.target.value);
                                }
                            }}
                        />
                        {/* Input field for entering the item's originalPrice */}
                        <input
                            className="input-price"
                            type="text"
                            inputMode="decimal"
                            placeholder="£ 12.50"
                            min="0"
                            step="0.01"
                            value={originalPrice}
                            onChange={(e) => {
                                if (isNumber(e.target.value)) {
                                    setOriginalPrice(e.target.value);
                                }
                            }}
                        />
                        <input
                            className="quantity"
                            type="text"
                            inputMode="numeric"
                            placeholder="qty"
                            min="0"
                            step="1"
                            value={quantity}
                            onChange={(e) => {
                                if (isNumber(e.target.value)) {
                                    setQuantity(e.target.value);
                                }
                            }}
                        />
                    </div>
                    <AddButton buttonName={"+"} type={"submit"} />
                </form>
                {listOfItems && (
                    <div className="receipt-capture__item-sub-total">
                        <p>Sub total: </p>
                        <p>
                            £{subTotal}
                            <span style={{ fontSize: "8px", fontWeight: "500" }}> (excl tax)</span>
                        </p>
                    </div>
                )}

                {/* List to display the added items */}
                <div className="receipt-capture__item-name-list">
                    <ul>
                        {listOfItems.map((item, index) => {
                            return <ObjectItem Item={item} />;
                        })}
                    </ul>
                </div>
                <NextButton buttonName={"< NEXT PAGE >"} to={"/ObjectItemSelection"} />
            </div>
        </div>
    );
}

export default ReceiptCapture;
