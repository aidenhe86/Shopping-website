import { useEffect } from "react";
import "./App.css";
import Homepage from "./homepage";
import Navbar from "./Navbar";

import { BrowserRouter } from "react-router-dom";

function App() {
  useEffect(() => {
    fetch("/api/ping")
      .then((resp) => resp.text())
      .then((text) => {
        console.log("Server status:", text);
      });
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <div className="App">
        <Homepage />
      </div>
    </BrowserRouter>
  );
}

export default App;
