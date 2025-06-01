import React from "react";
import ReactDOM from "react-dom/client";
import { createRoot } from "react-dom/client"; // gunakan createRoot, bukan ReactDOM.render
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { store } from "./app/store";
import axios from "axios";

axios.defaults.withCredentials = true; // Set axios untuk mengirim cookie

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// Optional: Tetap bisa pakai reportWebVitals
reportWebVitals();
