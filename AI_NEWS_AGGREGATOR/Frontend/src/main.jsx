import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "../context/UserContext.jsx";
import { NewsProvider } from "../context/NewsProvider.jsx";
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <NewsProvider>
          <App />
        </NewsProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
