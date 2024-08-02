import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

export const Context = createContext({ isAuthenticated: false });

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState({});
  const [patient, setPatient] = useState({
    name: "",
    address: "",
    age: null,
    phone: "",
  });

  return (
    <Context.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        admin,
        setAdmin,
        patient,
        setPatient,
      }}
    >
      <App />
    </Context.Provider>
  );
};
let container = null;

document.addEventListener("DOMContentLoaded", function (event) {
  if (!container) {
    container = document.getElementById("root");
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <AppWrapper />
      </React.StrictMode>
    );
  }
});
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <AppWrapper />
//   </React.StrictMode>
// );
