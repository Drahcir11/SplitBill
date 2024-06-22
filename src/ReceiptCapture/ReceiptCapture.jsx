import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Stack, IconButton, Box } from "@mui/material";
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
      })
    useEffect(()=>{
        sessionStorage.setItem("my-receipt-image", image);
    }, [image])

    const [submitFile, setSubmitFile] = useState(()=>{
        const storedSubmitFile = sessionStorage.getItem("my-submit-file");
        return storedSubmitFile ? storedSubmitFile : false;
    });
    useEffect(()=>{
        sessionStorage.setItem("my-submit-file", submitFile)
    },[submitFile])
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
        transformItemsStructure()
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

    const handleDeleteItem = (index)=>{
        setItemsPrice(itemsPrice.filter((_, priceIndex)=> priceIndex !== index));
        setItemsName(itemsName.filter((_, nameIndex)=> nameIndex !== index));

    }

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
                <h1 style={{ fontSize: "24px", fontWeight: "700", marginBlockEnd: "0px", marginBlockStart: "48px" }}>Receipt</h1>
                <h5 style={{ fontWeight: "500", fontSize: "12px", marginBlockStart: "16px", marginBlockEnd: "24px", color:"#5c5c5c"}}>
                    Capture the receipt with your camera and <b style={{fontWeight:"700", color:"black"}} >only</b> crop the area<br></br>
                    listing the <b style={{fontWeight:"700", color:"black"}}>item's name and prices</b>.
                </h5>
                {/* {!submitFile && ( */}
                <Button
                    variant="outlined"
                    component="label"
                    sx={{
                        textTransform: "none",
                        fontSize: "10px",
                        fontWeight: "700",
                        padding: "6px 10px 6px 10px",
                        borderColor: "#2B3A67",
                        color: "#2B3A67",
                        borderWidth: "2px",
                        "&:hover": {
                            backgroundColor: "#2B3A67", // Change to a different color on hover,
                            color: "white",
                        },
                        "&:active": {
                            backgroundColor: "#141F3B", // Change to a different color when clicked
                        },
                    }}
                >
                    UPLOAD IMAGE
                    <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" hidden />
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
                            borderWidth: "6px",
                            borderStyle: "solid",
                            borderColor: "white",
                            borderRadius: "4px",
                        }}
                    >
                        <Cropper
                            src={image}
                            style={{
                                height: "50vh",
                                width: "85vw",
                                maxWidth: "480px"
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
                                color: "white",
                                borderColor: "black",
                                backgroundColor: "#2B3A67 !important",
                                padding: "6px 10px 6px 10px",
                                borderWidth: "2px !important",
                                borderStyle: "solid !important",
                                fontSize: "10px",
                                fontWeight: "700",
                                width: "95%",
                            }}
                        >
                            Crop
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
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    marginTop: "48px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        borderWidth: "2px",
                    }}
                >
                    {itemsName.map((name, index) => (
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => handleNameChange(index, e)}
                            style={{
                                fontSize: "14px",
                                borderRadius: "10px",
                                padding: "10px 48px 10px 16px",
                                borderColor: "black",
                                borderWidth: "2px",
                                backgroundColor: "white",
                            }}
                        />
                    ))}
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}
                >
                    {itemsPrice.map((price, index) => (
                        <Stack direction="row" alignItems="center" justifyContent="center">
                            <input
                                type="text"
                                value={price}
                                onChange={(e) => handlePriceChange(index, e)}
                                style={{
                                    width: "60px",
                                    fontSize: "14px",
                                    paddingTop: "10px",
                                    paddingBottom: "10px",
                                    borderRadius: "10px",
                                    borderColor: "black",
                                    borderWidth: "2px",
                                    backgroundColor: "white",
                                    textAlign: "center",
                                    marginRight:"8px",
                                }}
                            />
                            <IconButton sx={{ paddingLeft: "0px"}}onClick={()=>{handleDeleteItem(index)}}>
                                <DeleteOutlineIcon sx={{ color: "red" }} />
                            </IconButton>
                        </Stack>
                    ))}
                </div>
            </div>
            <Box
                style={{
                    marginTop: "24px",
                    display: "flex",
                    justifyContent: "center",
                    justifyItems: "center",
                    textAlign: "center"
                }}
            >
                {submitFile && (
                    <Box
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            justifyItems: "center",
                            textAlign: "center"
                        }}    
                    >
                        <p style={{fontSize:"10px", marginBottom: "24px"}}> Add more items in next page. </p>
                        <Box
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                justifyItems: "center",
                                textAlign: "center"
                            }}    
                        >
                        <Button
                            variant="outlined"
                            component={Link}
                            to="/item"
                            sx={{
                                textTransform: "none",
                                fontSize: "10px",
                                fontWeight: "700",
                                padding: "5px 10px 5px 10px",
                                borderColor: "#2B3A67",
                                color: "#2B3A67",
                                borderWidth: "2px",
                                borderRadius: "8px",
                                "&:hover": {
                                    backgroundColor: "#2B3A67", // Change to a different color on hover,
                                    color: "white",
                                },
                                "&:active": {
                                    backgroundColor: "#141F3B", // Change to a different color when clicked
                                },
                                width: "60px"
                            }}
                        >
                            Next
                        </Button>
                    </Box>
                </Box>
                )}
            </Box>
        </div>
    );
}

export default ReceiptCapture;
