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
const commonButtonStyles = {
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
        // Concatenate the current "name" and "originalPrice" to the existing "items" array and update the "items" state.
        // setItems(items.concat({ name, originalPrice, sharedPrice, }));

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
                <div className="receipt-capture__button">
                    <Button
                        variant="outlined"
                        component="label"
                        sx={{
                            ...commonButtonStyles,
                            backgroundColor: "white",
                            marginRight: "32px",
                            "&:hover": {
                                ...commonButtonStyles["hover"],
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
                            ...commonButtonStyles,
                            backgroundColor: "#ad7aff",
                            "&:hover": {
                                ...commonButtonStyles["hover"],
                                backgroundColor: "white",
                            },
                        }}
                    >
                        CAPTURE
                        <input type="file" accept="image/*" capture onChange={handleFileChange} className="file-input" hidden />
                    </Button>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "16px",
                    marginTop: "24px",
                }}
            >
                {image && (
                    <div
                        style={{
                            borderWidth: "8px",
                            borderStyle: "solid",
                            borderColor: "white",
                            borderRadius: "2px",
                        }}
                    >
                        <Cropper
                            src={image}
                            style={{
                                height: "50vh",
                                width: "85vw",
                                maxWidth: "480px",
                            }}
                            initialAspectRatio={1}
                            guides={false}
                            ref={cropperRef}
                            dragMode={"none"}
                        />
                    </div>
                )}
                {submitFile && (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            width: "95%",
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleCrop}
                            className="crop-button"
                            sx={{
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
                            }}
                        >
                            CROP IMAGE
                        </Button>
                    </div>
                )}
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "40vw",
                }}
            ></div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    marginTop: "48px",
                }}
            >
                <div className="item-container">
                    <div className="item-list">
                        <h1
                            style={{ fontSize: "36px", marginBlockEnd: "0px", marginBlockStart: "48px", color: "white", textShadow: "2px 2px black" }}
                        >
                            ITEMS
                        </h1>
                        <h5 style={{ fontWeight: "700", fontSize: "12px", marginBlockStart: "0px", marginBlockEnd: "24px", color: "black" }}>
                            Add the list of purchased food items per unit price.
                        </h5>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                // width: "100vh"
                            }}
                        >
                            <form onSubmit={handleSubmit}>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <div
                                        className="input-container-maybe"
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            alignContent: "center",
                                            textAlign: "center",
                                            backgroundColor: "white",
                                            borderWidth: "2.5px",
                                            borderColor: "black",
                                            borderStyle: "solid",
                                            height: "3em",
                                            marginRight: "10px",
                                            borderRadius: "8px",
                                            boxShadow: "4px 4px",
                                            width: "90%",
                                        }}
                                    >
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
                                            style={{
                                                outline: "none",
                                                backgroundColor: "transparent",
                                                borderColor: "transparent",
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
                                            style={{
                                                outline: "none",
                                                backgroundColor: "transparent",
                                                borderColor: "transparent",
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
                                            style={{
                                                outline: "none",
                                                backgroundColor: "transparent",
                                                borderColor: "transparent",
                                            }}
                                        />
                                    </div>
                                    {/* Button to add the item to the list */}
                                    <AddButton buttonName={"+"} type={"submit"} />
                                </div>
                            </form>
                        </div>
                        {listOfItems && (
                            <div
                                style={{
                                    marginTop: "16px",
                                    marginBottom: "16px",
                                    border: "2px solid",
                                    borderRadius: "16px",
                                    fontWeight: "500",
                                    backgroundColor: "#fff",
                                    fontSize: "12px",
                                    width: "100%",
                                    maxWidth: "357px",
                                    paddingRight: "16px",
                                    paddingLeft: "10px",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <p style={{ fontWeight: "700" }}>Sub total: </p>
                                <p style={{ fontSize: "12px", fontWeight: "700" }}>
                                    £{subTotal}
                                    <span style={{ fontSize: "8px", fontWeight: "500" }}> (excl tax)</span>
                                </p>
                            </div>
                        )}

                        {/* List to display the added items */}
                        <div className="item-name-list">
                            {/* <ul>
                        {items.map((item, index) =>
                            // Each item in the "items" array is displayed as a list item with its name and originalPrice.
                            {
                                if (item.isEdit) {
                                    return <EditItem Item={item} index={index} items={items} setItems={setItems} />;
                                } else {
                                    return <Item Item={item} index={index} items={items} setItems={setItems} />;
                                }
                            }
                        )}
                    </ul> */}
                            <ul>
                                {listOfItems.map((item, index) => {
                                    return <ObjectItem Item={item} />;
                                })}
                            </ul>
                        </div>
                        <NextButton buttonName={"< NEXT PAGE >"} to={"/ObjectItemSelection"} />
                    </div>
                </div>
                {/* {itemsName.map((name, index) => (
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            marginBottom: "16px",
                            backgroundColor: "white",
                            borderWidth: "2.5px",
                            borderColor: "black",
                            borderStyle: "solid",
                        }}
                    >
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => handleNameChange(index, e)}
                            style={{
                                fontSize: "14px",
                                fontWeight: "700",
                                padding: "5px 10px",
                                borderColor: "transparent",
                                backgroundColor: "white",
                                outline: "none",
                            }}
                        />
                        <Divider orientation="vertical" variant="middle" flexItem />
                        <input
                            type="text"
                            value={itemsPrice[index]}
                            onChange={(e) => handlePriceChange(index, e)}
                            style={{
                                width: "50px",
                                fontSize: "14px",
                                fontWeight: "700",
                                paddingTop: "10px",
                                paddingBottom: "10px",
                                borderColor: "transparent",
                                textAlign: "center",
                                outline: "none",
                            }}
                        />
                        <Divider orientation="vertical" variant="middle" flexItem />
                        <IconButton
                            sx={{ paddingLeft: "0px" }}
                            onClick={() => {
                                handleDeleteItem(index);
                            }}
                        >
                            <DeleteOutlineIcon sx={{ color: "red", marginRight: "8px", marginLeft: "16px" }} />
                        </IconButton>
                    </Stack>
                ))} */}
            </div>
            {/* <Box
                style={{
                    marginTop: "24px",
                    display: "flex",
                    justifyContent: "center",
                    justifyItems: "center",
                    textAlign: "center",
                }}
            >
                {submitFile && (
                    <Box
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            justifyItems: "center",
                            textAlign: "center",
                        }}
                    >
                        <Box
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                justifyItems: "center",
                                textAlign: "center",
                            }}
                        >
                            <Button
                                variant="outlined"
                                component={Link}
                                to="/item"
                                sx={{
                                    textTransform: "none",
                                    fontFamily: "monospace",
                                    fontSize: "12px",
                                    fontWeight: "1000",
                                    padding: "5px 5px",
                                    borderColor: "black",
                                    color: "black",
                                    borderWidth: "2.5px",
                                    borderRadius: "4px",
                                    backgroundColor: "#ad7aff",
                                    boxShadow: "4px 3px",
                                    "&:hover": {
                                        backgroundColor: "#7e2fff", // Change to a different color on hover,
                                        color: "black",
                                        borderWidth: "2.5px",
                                        borderColor: "black",
                                        boxShadow: "0px 0px",
                                    },
                                }}
                            >
                                {nextPageString}
                            </Button>
                            <p style={{ fontSize: "10px", marginBottom: "24px" }}> Add more items in next page. </p>
                        </Box>
                    </Box>
                )}
            </Box> */}
        </div>
    );
}

export default ReceiptCapture;
