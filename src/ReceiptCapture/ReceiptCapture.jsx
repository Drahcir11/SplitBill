import { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import Cropper from "react-cropper";
import Tesseract from "tesseract.js";
import "cropperjs/dist/cropper.css";
import "./ReceiptCapture.css"; // Assuming you have a CSS file for styling
import NextButton from "../Button/NextPageButton";
import ObjectItem from "../ItemList/ObjectItem";
import ObjectCharges from "../TaxList/ObjectCharges";
import { useBillContext } from "../Hooks/useBillContext";
import { isNumber, isValidInput, noWhiteSpace } from "../ErrorHandling";
import AddButton from "../Button/AddButton";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import ItemsList from "../ItemList/ItemsList";

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
    const { dispatch, listOfItems, listOfCharges, itemSubTotalCost, itemTotalCost } = useBillContext();

    const [chargesValue, setChargesValue] = useState("");

    const [chargesCategory, setChargesCategory] = useState("Tax");
    const [chargesValueType, setChargesValueType] = useState("");

    const handleChargesSubmit = (e) => {
        e.preventDefault();

        // Do nothing when charges value not set
        if(!chargesValue) {
            return;
        }

        // Do nothing when charges value is set to empty string
        if (!noWhiteSpace(chargesValue)) {
            return;
        }

        dispatch({ type: "ADD_CHARGES", payload: { chargesCategory, chargesValueType, chargesValue } });
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

    // When user crops the image, extract item and price details from image
    const handleCrop = () => {
        const cropper = cropperRef.current.cropper;
        cropper.getCroppedCanvas().toBlob((blob) => {
            const image = URL.createObjectURL(blob);

            // Empty the list of items before cropping image
            dispatch({ type: "RESET_ITEMS" });
            extractText(image);
        });
    };

    const extractText = (image) => {
        Tesseract.recognize(image, "eng", {
            tessedit_pageseg_mode: 6, // Something to do with it being blocks
            tessedit_ocr_engine_mode: 1,
        }).then(({ data: { text } }) => {
            // Loop through each text and structure it into items and prices
            let extractedText = text.split("\n");
            extractedText.forEach((item) => {
                // Regular expression to match item name and price
                // e.g. Pizza £12.55
                const regexMatches = item.match(/(.+?)\s*(?:\$|RS|Rs|rs|Rupees|rupees|pkr|£|Rp|RP|rp|)\s*?(\d+(?:\.\d{1,2}))/);

                // Structure string when item price combination matches regex
                if (regexMatches) {
                    const itemName = regexMatches[1].trim();
                    const itemPrice = regexMatches[2].replace(/[\$£]/g, "").trim();

                    // Add new item and its price to the list of items in context manager
                    dispatch({ type: "ADD_ITEM", payload: { itemName: itemName, unitPrice: itemPrice, quantity: 1 } });
                }
                // When string doesn't match regex and its not an empty white space, then add item with no price
                else if (item.trim().length > 0) {
                    dispatch({ type: "ADD_ITEM", payload: { itemName: item, unitPrice: 0.0, quantity: 1 } });
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
            <ItemsList/>
            <div className="receipt-capture__tax-container">
                <h1>TAX & DISCOUNTS</h1>
                <h5>Add the list of tax charges or discounts.</h5>
                <div className="receipt-capture__form-container" style={{ display: "flex", flexDirection: "row" }}>
                    <FormControl
                        sx={{
                            m: 1,
                            minWidth: 150,
                            backgroundColor: "white",
                            boxShadow: "none",
                            ".MuiOutlinedInput-notchedOutline": {
                                border: "2.5px",
                                borderColor: "black",
                                borderStyle: "solid",
                            },
                        }}
                        size="small"
                    >
                        <InputLabel id="charges-category-label">Tax/Discounts</InputLabel>
                        <Select
                            labelId="charges-category-label"
                            id="charges-category"
                            value={chargesCategory}
                            label="Service Charges"
                            sx={{
                                "& #charges-category": {
                                    fontSize: "0.8em",
                                },
                            }}
                            onChange={(e) => {
                                setChargesCategory(e.target.value);
                            }}
                        >
                            <MenuItem value={"Tax"}>
                                Tax
                            </MenuItem>
                            <MenuItem value={"Discount"}>Discount</MenuItem>
                        </Select>
                    </FormControl>
                    <form onSubmit={handleChargesSubmit}>
                        <input
                            className="receipt-capture_input-charges-value"
                            type="text"
                            inputMode="decimal"
                            placeholder="12.5"
                            min={0}
                            max={100}
                            step={0.01}
                            value={chargesValue}
                            onChange={(e) => {
                                setChargesValue(e.target.value);
                            }}
                        />
                        <FormControl
                            sx={{
                                m: 1,
                                minWidth: 70,
                                backgroundColor: "white",
                                boxShadow: "none",
                                ".MuiOutlinedInput-notchedOutline": {
                                    border: "2.5px",
                                    borderColor: "black",
                                    borderStyle: "solid",
                                },
                            }}
                            size="small"
                        >
                            {!chargesValueType && <InputLabel id="charges-value-type-select-label">%</InputLabel>}
                            {chargesValueType && <InputLabel id="charges-value-type-select-label">{chargesValueType}</InputLabel>}
                            <Select
                                labelId="charges-value-type-select-label"
                                id="charges-value-type-select"
                                value={chargesValueType}
                                label="Charges Value Type"
                                inputProps={{ sx: { pr: "12px !important" }, IconComponent: () => null }}
                                sx={{
                                    "& #charges-value-type-select": {
                                        fontSize: "0.8em",
                                    },
                                }}
                                onChange={(e) => {
                                    setChargesValueType(e.target.value);
                                }}
                            >
                                <MenuItem value={"Percentage"}>%</MenuItem>
                                <MenuItem value={"Numeric"}>.123</MenuItem>
                            </Select>
                        </FormControl>
                        <AddButton buttonName={"+"} type={"submit"} />
                    </form>
                </div>
                {listOfItems && (
                    <div className="receipt-capture__item-cost-container">
                        <div className="receipt-capture__item-charges-sub-total">
                            <p>Sub total: </p>
                            <p>
                                £{itemSubTotalCost}
                                <span style={{ fontSize: "8px", fontWeight: "500" }}> (excl tax)</span>
                            </p>
                        </div>
                        <div className="receipt-capture__item-charges-total-cost">
                            <p>Total cost: </p>
                            <p>
                                £{itemTotalCost}
                            </p>
                        </div>
                    </div>
                )}

                {/* List to display the added items */}
                <div className="receipt-capture__item-name-list">
                    <ul>
                        {listOfCharges.map((charges, index) => {
                            return <ObjectCharges key={index} Charges={charges} />;
                        })}
                    </ul>
                </div>
                <NextButton buttonName={"< NEXT PAGE >"} to={"/ObjectItemSelection"} />
            </div>
        </div>
    );
}

export default ReceiptCapture;
