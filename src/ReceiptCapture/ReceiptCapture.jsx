import "./ReceiptCapture.css";
import "cropperjs/dist/cropper.css";

import { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import Cropper from "react-cropper";
import Tesseract from "tesseract.js";

import { useBillContext } from "../Hooks/useBillContext";
import ItemsList from "../ItemList/ItemsList";
import TaxList from "../TaxList/TaxList";

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
    const {dispatch} = useBillContext();

    // const [image, setImage] = useState(() => {
    //     const storedReceiptImage = sessionStorage.getItem("my-receipt-image");
    //     return storedReceiptImage ? storedReceiptImage : null;
    // });
    
    const [image, setImage] = useState(null);

    // const [submitFile, setSubmitFile] = useState(() => {
    //     const storedSubmitFile = sessionStorage.getItem("my-submit-file");
    //     return storedSubmitFile ? storedSubmitFile : false;
    // });
    
    const [submitFile, setSubmitFile] = useState(false);

    const cropperRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
        setSubmitFile(true);
        console.log("handle file change success")
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
        console.log("handle crop success")
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
                // e.g below:
                //      Pizza £12.55
                //      Burger 20.10
                //      Chicken Steak 500g 9.99

                const regexMatches = item.match(/(.+?)\s*(?:\$|RS|Rs|rs|Rupees|rupees|pkr|£|Rp|RP|rp|)\s*?(\d+(?:\.\d{1,2}))/);
                const rupiahRegexMatches = item.match(/^(.*?)\s*(?:\$|RS|Rs|rs|Rupees|rupees|pkr|£|Rp|RP|rp|)?\s*(\d+(?:[.,]\d+)*)$/);

                // Structure string when item price combination matches regex
                if (regexMatches) {
                    const itemName = regexMatches[1].trim();
                    const itemPrice = regexMatches[2].replace(/[\$£]/g, "").trim();

                    // Add new item and its price to the list of items in context manager
                    dispatch({ type: "ADD_ITEM", payload: { itemName: itemName, unitPrice: itemPrice, quantity: 1 } });
                }
                else if (rupiahRegexMatches){
                    const itemName = rupiahRegexMatches[1].trim();
                    const itemPrice = String(rupiahRegexMatches[2].replace(/[\Rp]/g, "").trim());
                    dispatch({ type: "ADD_ITEM", payload: { itemName: itemName, unitPrice: itemPrice, quantity: 1 } });
                }
                // When string doesn't match regex and its not an empty white space, then add item with no price
                else if (item.trim().length > 0) {
                    dispatch({ type: "ADD_ITEM", payload: { itemName: item, unitPrice: "0", quantity: 1 } });
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
                {image ? (
                    <div className="receipt-capture__image-content">
                        <Cropper src={image} initialAspectRatio={1} guides={false} ref={cropperRef} dragMode={"none"} />
                    </div>
                ):(
                        <div style={{width:"90%", height:"380px", border:"2px solid black", 
                        borderRadius:"16px", backgroundColor:"white", display:"flex",
                        alignItems:"center", justifyContent:"center",
                        }}>
                                <p style={{margin:0, opacity:"30%"}}>RECEIPT IMAGE</p>
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
            <TaxList/>
        </div>
    );
}

export default ReceiptCapture;
