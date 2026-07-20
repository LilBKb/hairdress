import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import App from "./App.tsx";
import { branches } from "./data/branches.tsx";
import AuthPage from "./pages/AuthPage/AuthPage";
import RegistrationPage from "./pages/RegistrationPage/RegistrationPage";
import BookingPage from "./pages/BookingPage/BookingPage";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/registration" element={<RegistrationPage />} />
          {branches.map((item, index) => (
            <Route key={index} path={item.url} element={item.element} />
          ))}
          <Route path="/redFoxReserve" element={<BookingPage />} />
          <Route path="/barbershopReserve" element={<BookingPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
