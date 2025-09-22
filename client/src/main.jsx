/*

import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css";
import App from "./App";
import { DuckProvider } from "./context/DuckContext";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DuckProvider>
      <App />
    </DuckProvider>
  </React.StrictMode>
);

*/

import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.css";
import App from "./App";
import { HouseContextProvider } from "./context/HouseContext";
import "./styles/index.css";

// wrapping the HouseContextProvider this way all parts of the app have excess to house context

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HouseContextProvider>
      <App />
    </HouseContextProvider>
  </React.StrictMode>
);
