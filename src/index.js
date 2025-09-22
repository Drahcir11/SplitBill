import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BillContextProvider } from "./context/BillContext.js";
import { Analytics } from '@vercel/analytics/react';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BillContextProvider>
            <App />
            <Analytics />
        </BillContextProvider>
    </React.StrictMode>
);
