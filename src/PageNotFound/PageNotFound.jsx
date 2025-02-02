import NextButton from "../Button/NextPageButton";

export default function PageNotFound() {
    return (
        <div style={{ height:"100%", minHeight:"100vh", marginTop:"32px", textAlign:"center"}}>
            <h1 style={{ fontSize: "2em", fontWeight: "1000", textShadow: "2px 2px black", color: "white" }}>
                PAGE NOT FOUND
            </h1>
            <h5 style={{fontWeight:"700", fontSize:"12px", color:"black", textAlign:"center"}}> The page you are looking for doesn't exist </h5>
            <NextButton buttonName={"< BACK HOME >"} to={"/"} />
        </div>
    );
}
