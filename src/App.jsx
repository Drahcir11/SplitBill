import FriendsList from "./FriendsList/FriendsList";
import EachOwed from "./EachOwed/EachOwed";
import NavBar from "./NavBar/NavBar";
import About from "./About/About";
import HowTo from "./HowTo/HowTo";
import ReceiptCapture from "./ReceiptCapture/ReceiptCapture";
import ObjectItemSelection from "./ItemSelection/ObjectItemSelection";
import PageNotFound from "./PageNotFound/PageNotFound";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {

    return (
        <div className="container">
            <Router>
                <div className="nav-app" style={{ position: "fixed", top: "0", width: "100%", zIndex:"1",}}>
                    <NavBar />
                </div>
                <div className="App" style={{ paddingTop:"50px"}}>
                    <Routes>
                        <Route path="/about" element={<About />} />
                        <Route path="/howto" element={<HowTo />} />
                        <Route path="/" element={<FriendsList />} />
                        <Route path="/ObjectItemSelection" element={<ObjectItemSelection />}/>
                        <Route path="/ReceiptCapture" element={<ReceiptCapture />} />
                        <Route path="/eachOwed"element={<EachOwed />}/>
                        <Route path="*" element={ <PageNotFound />} />
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App