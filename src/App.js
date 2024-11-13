import FriendsList from "./FriendsList/FriendsList";
import EachOwed from "./EachOwed";
import NavBar from "./NavBar/NavBar";
import About from "./About/About";
import HowTo from "./HowTo/HowTo";
import ReceiptCapture from "./ReceiptCapture/ReceiptCapture";
import ObjectItemSelection from "./ItemSelection/ObjectItemSelection";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {

    return (
        <div className="container">
            <Router>
                <div className="nav-app">
                    <NavBar />
                </div>
                <div className="App">
                    <Routes>
                        <Route path="/about" element={<About />} />
                        <Route path="/howto" element={<HowTo />} />
                        <Route path="/" element={<FriendsList />} />
                        <Route path="/ObjectItemSelection" element={<ObjectItemSelection />}/>
                        <Route path="/ReceiptCapture" element={<ReceiptCapture />} />
                        <Route path="/eachOwed"element={<EachOwed />}/>
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App