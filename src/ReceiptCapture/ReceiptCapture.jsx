import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Stack, Box, Divider, IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import Cropper from "react-cropper";
import Tesseract from "tesseract.js";
import "cropperjs/dist/cropper.css";
import "./ReceiptCapture.css"; // Assuming you have a CSS file for styling
import NextButton from "../Button/NextPageButton";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function ReceiptCapture({ props }) {
    const { itemsName, setItemsName, itemsPrice, setItemsPrice, setItems } = props;

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

    useEffect(() => {
        const transformItemsStructure = () => {
            const finalItemsName = itemsName;
            const finalItemsPrice = itemsPrice;

            const finalItemsList = [];

            for (let i = 0; i < finalItemsName.length; i++) {
                finalItemsList.push({
                    name: finalItemsName[i],
                    originalPrice: finalItemsPrice[i],
                    quantity: 1,
                    sharedPrice: 0,
                    friends: [],
                    isEdit: false,
                });
            }

            setItems(finalItemsList);

            console.log("final items list :", finalItemsList);
        };
        transformItemsStructure();
    }, [itemsName, itemsPrice]);

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
                }
            });

            setItemsName(itemNames);
            setItemsPrice(itemPrices);
        });
    };

    const handleNameChange = (index, event) => {
        const newItems = [...itemsName];
        newItems[index] = event.target.value;
        setItemsName(newItems);
    };

    const handlePriceChange = (index, event) => {
        const newPrices = [...itemsPrice];
        newPrices[index] = event.target.value;
        setItemsPrice(newPrices);
    };

    const handleDeleteItem = (index) => {
        setItemsPrice(itemsPrice.filter((_, priceIndex) => priceIndex !== index));
        setItemsName(itemsName.filter((_, nameIndex) => nameIndex !== index));
    };

    const nextPageString = "< NEXT PAGE >";

    return (
        <div
            className="receipt-capture"
            style={{
                height: "100%",
                minHeight: "100vh",
                marginBottom: "48px",
                maxWidth: "480px",
            }}
        >
            <div
                style={{
                    textAlign: "center",
                }}
            >
                <h1 style={{ fontSize: "24px", fontWeight: "1000", marginBlockEnd: "0px", marginBlockStart: "48px", color: "black" }}>Receipt</h1>
                <h5 style={{ fontWeight: "500", fontSize: "12px", marginBlockStart: "16px", marginBlockEnd: "24px", color: "#5c5c5c" }}>
                    Capture the receipt with your camera and <b style={{ fontWeight: "700", color: "black" }}>only</b> crop the area<br></br>
                    listing the <b style={{ fontWeight: "700", color: "black" }}>item's name and prices</b>.
                </h5>
                <Button
                    variant="outlined"
                    component="label"
                    sx={{
                        textTransform: "none",
                        fontSize: "12px",
                        fontWeight: "1000",
                        padding: "5px 10px",
                        borderColor: "black",
                        color: "black",
                        borderWidth: "2.5px",
                        backgroundColor: "white",
                        "&:hover": {
                            backgroundColor: "#c4a1ff",
                            borderWidth: "2.5px",
                            borderColor: "black",
                            color: "black",
                            boxShadow: "0px 0px"
                        },
                        marginRight: "32px",
                        boxShadow: "3px 3px",
                    }}
                >
                    UPLOAD
                    <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" hidden />
                </Button>
                <Button
                    variant="outlined"
                    component="label"
                    sx={{
                        textTransform: "none",
                        fontSize: "12px",
                        fontWeight: "1000",
                        padding: "5px 10px",
                        borderColor: "black",
                        color: "black",
                        borderWidth: "2.5px",
                        backgroundColor: "#c4a1ff",
                        "&:hover": {
                            backgroundColor: "white",
                            borderWidth: "2.5px",
                            borderColor: "black",
                            color: "black",
                            boxShadow: "0px 0px"
                        },
                        boxShadow: "3px 3px"
                    }}
                >
                    CAPTURE
                    <input type="file" accept="image/*" capture onChange={handleFileChange} className="file-input" hidden />
                </Button>
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
                                boxShadow: "4px 4px"
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
                    flexDirection:"column",
                    justifyContent: "center",
                    alignContent: "center",
                    marginTop: "48px",
                }}
            >
                    {
                        itemsName.map((name, index)=>(

                            <Stack direction="row" alignItems="center" justifyContent="center"
                                sx={{ 
                                    marginBottom:"16px", 
                                    backgroundColor: "white", 
                                    borderWidth: "2.5px", 
                                    borderColor: "black", 
                                    borderStyle:"solid",
                                    
                                }}>

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
                                        outline: "none"
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
                                        outline: "none"
                                    }}
                            />
                            <Divider orientation="vertical" variant="middle" flexItem />
                            <IconButton sx={{ paddingLeft: "0px"}}onClick={()=>{handleDeleteItem(index)}}>
                                <DeleteOutlineIcon sx={{ color: "red", marginRight: "8px", marginLeft: "16px" }} />
                            </IconButton>
                            </Stack>
                        ))
                    }
            </div>
            <Box
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
                                    backgroundColor: "#e3dff2",
                                    boxShadow: "4px 3px",
                                    "&:hover": {
                                        backgroundColor: "#9723c9", // Change to a different color on hover,
                                        color: "black",
                                        borderWidth: "2.5px",
                                        borderColor: "black",
                                        boxShadow: "0px 0px"
                                    },
                                }}
                            >
                                {nextPageString}
                            </Button>
                            <p style={{ fontSize: "10px", marginBottom: "24px" }}> Add more items in next page. </p>
                        </Box>
                    </Box>
                )}
            </Box>
        </div>
    );
}

export default ReceiptCapture;
