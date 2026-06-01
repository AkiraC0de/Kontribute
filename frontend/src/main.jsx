import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import store from "./services/store/store.js";
import "./index.css";
import App from "./App.jsx";
import SnackbarNotificationWrapper from "./services/snackbar-notification/components/SnackbarNotificationWrapper.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <SnackbarNotificationWrapper>
          <App />
        </SnackbarNotificationWrapper>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
);
